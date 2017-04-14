/** @babel */

import fs from 'fs';
import crypto from 'crypto';
import PSD from 'psd';

const fontWeightNames = {
  thin: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  book: 400,
  normal: 400,
  regular: 400,
  roman: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  ultrabold: 800,
  black: 900,
  heavy: 900
};

export default class PsdParser {
  static toRGBa(color, alpha = 1){
    return `rgb(${Math.round(color['Rd  '])}, ${Math.round(color['Grn '])}, ${Math.round(color['Bl  '])}, ${alpha})`;
  }

  constructor(uri, cacheDir){
    this._uri = uri;
    this._imageHash = crypto.createHash('sha1').update(fs.readFileSync(uri)).digest('hex');
    this.imageUri = `${cacheDir}/${this.imageHash}.png`;
    this.jsonUri = `${cacheDir}/${this.imageHash}.json`;
  }

  async parse() {
    if (fs.existsSync(this.imageUri)) {
      return require(this.jsonUri);
    }

    const psd = PSD.fromFile(this._uri);
    psd.parse();

    const extractedData = psd.tree().descendants().map((node) => {
      const getter = (k) => (node.get(k) || {
        data: undefined,
        export: () => undefined,
        styles: () => undefined,
        color: () => undefined,
      });

      return {
        node: node.export(),
        vectorOrigination: getter('vectorOrigination').data,
        fillOpacity: getter('fillOpacity'),
        vectorMask: getter('vectorMask').export(),
        objectEffects: getter('objectEffects').data,
        vectorStroke: getter('vectorStroke').data,
        vectorStrokeContent: getter('vectorStrokeContent').data,
        typeTool: getter('typeTool').styles(),
        solidColor: getter('solidColor').color()
      };
    });

    // caching parsed psd
    fs.writeFileSync(this.jsonUri, JSON.stringify(extractedData));
    await psd.image.saveAsPng(this.imageUri);

    return extractedData;
  }

  //handleObjClick
  parseObject(data) {
    let layerStyles = {
      blendingMode: data.node.blendingMode,
      width: data.node.width,
      height: data.node.height,
      top: data.node.top,
      left: data.node.left,
      opacity: data.node.opacity,
      name: data.node.name
    };

    if (data.vectorStroke) {
      const o = data.vectorStroke;
      layerStyles.border = `${o.strokeStyleLineWidth.value}px solid ${PsdParser.toRGBa(o.strokeStyleContent['Clr '], o.strokeStyleOpacity.value) / 100}`;
    }

    if (data.vectorOrigination) {
      const o = data.vectorOrigination.keyDescriptorList[0].keyOriginRRectRadii;
      if (o) {
        const bdrd = [
          Math.round(o.topLeft.value),
          Math.round(o.topRight.value),
          Math.round(o.bottomLeft.value),
          Math.round(o.bottomRight.value)
        ];
        layerStyles.borderRadius = bdrd.join('px ');
      }
    }

    if (data.typeTool && data.node.text) {
      const font = data.node.text.font,
        fontFamily = font.name.split('-'),
        colors = font.colors[0].pop(),
        transY = data.node.text.transform.yy;

      layerStyles.color = `rgb(${font.colors[0].join(', ')})`;
      layerStyles.fontSize = Math.round((font.sizes[0] * transY) * 100) * 0.01;;
      layerStyles.text = data.node.text.value.replace(/\n/g, ' ');
      layerStyles.lineHeight = data.typeTool.Leading
        ? Math.round((data.typeTool.Leading[0] * transY) * 100) * 0.01
        : undefined;
      layerStyles.fontFamily = fontFamily.join(' ');

      layerStyles.fontWeight = fontFamily.length > 1
        ? fontWeightNames[fontFamily.pop().toLowerCase()]
        : undefined;

      layerStyles.textTransform = data.typeTool.FontCaps && data.typeTool.FontCaps[0] === 2
        ? 'uppercase'
        : undefined;
    }

    if (data.objectEffects) {
      Object.assign(layerStyles, this.parseObjectEffects(data.objectEffects));
      layerStyles.textShadow = data.node.text ? layerStyles.dropShadow : undefined;
      layerStyles.boxShadow = layerStyles.dropShadow ? layerStyles.dropShadow : undefined;
      layerStyles.dropShadow = undefined;
    }

    console.log(data);
    layerStyles.backgroundColor = data.solidColor ? `rgb(${data.solidColor.join(', ')})` : undefined;

    return layerStyles;
  }

  parseObjectEffects(objectEffects) {
    const response = {};

    if (objectEffects.DrSh) {
      const color = PsdParser.toRGBa(objectEffects.DrSh['Clr '], (objectEffects.DrSh['Opct'].value / 100)),
        angle = objectEffects.DrSh.lagl.value,
        distance = objectEffects.DrSh.Dstn.value,
        x = distance * Math.cos(angle),
        y = distance * Math.sin(angle);

      response.dropShadow = `${x}px ${y}px ${objectEffects.DrSh.blur.value}px ${objectEffects.DrSh.Ckmt.value}px ${color}`;
    }

    if (objectEffects.GrFl) {
      // background: linear-gradient(direction, color-stop1, color-stop2, ...);
      const angle = gf.Angl.value + 90,
        stopsString = objectEffects.GrFl.Grad.Clrs.map((c, i) => PsdParser.toRGBa(c['Clr '], objectEffects.GrFl.Grad.Trns[i].Opct.value / 100)).join(', ');

      response.linearGradient = `linear-gradient(${angle}deg, ${stopsString})`;
    }

    return response;
  }
}
