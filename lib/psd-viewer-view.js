/** @babel */
/** @jsx etch.dom */

import crypto from 'crypto';
import os from 'os';
import fs from 'fs';
import etch from 'etch';
import PSD from 'psd';

const cacheDir = `${os.tmpdir()}/atom-psd-viewer-${Date.now()}`;

class PsdObject {
  constructor(props, children) {
    this.props = props;
    this.children = children;
    etch.initialize(this);
  }

  update() {}

  render() {
    return (
      <div class={this.props.class} style={this.props.style} onClick={() => this.props.onClick(this.props.object)}></div>
    );
  }
}

export default class PsdExtractView {

  constructor(uri) {
    etch.initialize(this);

    try {
      fs.mkdirSync(cacheDir);
    } catch (e) {}

    this.uri = uri;

    this.imageHash = crypto.createHash('sha1').update(fs.readFileSync(uri)).digest('hex');
    this.parseFile(uri, (s) => this.showPreview(s));

    this._zoom = 100;
    this.refs.zoomOutButton.addEventListener('click', () => this.setZoom(-10));
    this.refs.zoomInButton.addEventListener('click', () => this.setZoom(+ 10));
  }

  showPreview(Styles) {
    this.refs.psdImage.src = `${cacheDir}/${this.imageHash}.png`;
    this.refs.psdImage.onload = () => this.createObjects(Styles);
  }

  setZoom(r) {
    this._zoom = Math.min(Math.max(this._zoom + r, 1), 500);
    this.refs.psdZoomable.style.transform = `scaleX(${this._zoom / 100}) scaleY(${this._zoom / 100})`;
  }

  update(...args) {
    console.log(args);
  }

  /*cE(className) {
    const el = document.createElement('div');
    el.classList.add(className);
    return el;
  }

  // create div with id
  cEiD(id) {
    const el = document.createElement('div');
    el.setAttribute('id', id)
    return el;
  }*/

  getTitle() {
    return this.uri;
  }

  /*resizer() {

    var self = this;
    var resizer = this.cE('resizer');
    this.element.appendChild(resizer);

    var clicked = false;
    var startX = 0;

    var paneWidth = 0;

    resizer.addEventListener('mousedown', function(event) {

      startX = event.clientX;
      clicked = true;
      paneWidth = self.element.offsetWidth;
    });

    window.addEventListener('mouseup', function() {

      clicked = false;
      paneWidth = self.element.offsetWidth;
    });

    window.addEventListener('mousemove', function(event) {

      if (clicked) {
        self.element.style.width = (paneWidth + (startX - event.clientX)) + 'px';
      }
    });
  }*/

  render() {
    return (
      <div className='psdViewer' tabIndex='-1'>
        {/*
        <div className='image-controls' ref='imageControls'>
          <div className='image-controls-group btn-group'>
            <button className='btn' ref='zoomOutButton'>-</button>
            <button className='btn reset-zoom-button' ref='resetZoomButton'>100%</button>
            <button className='btn' ref='zoomInButton'>+</button>
          </div>
          <div className='image-controls-group btn-group'>
            <button className='btn' ref='zoomToFitButton'>Zoom to fit</button>
          </div>
        </div>
        */}
        <div className='psdContainer' background='white' ref='psdContainer'>
          <div className='psdZoomable' ref='psdZoomable'>
            <img className='psdImage' ref='psdImage'></img>
            <div className='objects' ref='objects'></div>
          </div>
        </div>
        <div className='psdControls'>
          <button className='btn' ref='zoomOutButton'>-</button>
          <button className='btn reset-zoom-button' ref='resetZoomButton'>100%</button>
          <button className='btn' ref='zoomInButton'>+</button>
        </div>
      </div>
    )
  }

  /*createNotification() {

    this.notification = this.cE('tooltip');
    this.notification.classList.add('native-key-bindings');
    this.notification.setAttribute('tabindex', -1);

    this.notification.name = this.cE('t-name');
    this.notification.appendChild(this.notification.name);

    this.notification.text = this.cE('t-text');
    this.notification.appendChild(this.notification.text);

    this.notification.blendingMode = this.cE('t-blendig-mode');
    this.notification.appendChild(this.notification.blendingMode);

    this.notification.width = this.cE('t-width');
    this.notification.appendChild(this.notification.width);

    this.notification.height = this.cE('t-height');
    this.notification.appendChild(this.notification.height);

    this.notification.top = this.cE('t-top');
    this.notification.appendChild(this.notification.top);

    this.notification.left = this.cE('t-left');
    this.notification.appendChild(this.notification.left);

    this.notification.opacity = this.cE('t-opacity');
    this.notification.appendChild(this.notification.opacity);

    this.notification.backgroundColor = this.cE('t-background-color');
    this.notification.appendChild(this.notification.backgroundColor);

    this.notification.linearGradient = this.cE('t-linear-backround');
    this.notification.appendChild(this.notification.linearGradient);

    this.notification.boxShadow = this.cE('t-box-shadow');
    this.notification.appendChild(this.notification.boxShadow);

    this.notification.border = this.cE('t-border');
    this.notification.appendChild(this.notification.border);

    this.notification.borderRadius = this.cE('t-border-badius');
    this.notification.appendChild(this.notification.borderRadius);

    this.notification.fontFamily = this.cE('t-font-family');
    this.notification.appendChild(this.notification.fontFamily);

    this.notification.fontSize = this.cE('t-font-size');
    this.notification.appendChild(this.notification.fontSize);

    this.notification.fontWeight = this.cE('t-font-weight');
    this.notification.appendChild(this.notification.fontWeight);

    this.notification.lineHeight = this.cE('t-line-height');
    this.notification.appendChild(this.notification.lineHeight);

    this.notification.textShadow = this.cE('t-text-shadow');
    this.notification.appendChild(this.notification.textShadow);

    this.notification.textTransform = this.cE('t-text-transform');
    this.notification.appendChild(this.notification.textTransform);

    this.notification.color = this.cE('t-color');
    this.notification.appendChild(this.notification.color);

    this.notification.backgroundColorPreview = this.cE('t-color-preview');
    this.notification.appendChild(this.notification.backgroundColorPreview);

    this.refs.objects.appendChild(this.notification);
  }*/

  createObjects(Styles) {
    var self = this;
    const psdImage = this.refs.psdImage,
      psdWidth = this.refs.psdImage.naturalWidth,
      psdHeight = this.refs.psdImage.naturalHeight;

    const toPercentageX = pixels => pixels * 100 / psdWidth,
      toPercentageY = pixels => pixels * 100 / psdHeight,
      toRGBa = (color, alpha = 1) => `rgb(${Math.round(color['Rd  '])}, ${Math.round(color['Grn  '])}, ${Math.round(color['Bl  '])}, ${alpha})`;

    function handleObjClick(data) {
      const layerStyles = {
        blendingMode: data.node.blendingMode,
        width: data.node.width,
        height: data.node.height,
        top: data.node.top,
        left: data.node.left,
        opacity: data.node.opacity,
        name: data.node.name,
      };

      if (data.vectorStroke) {
        const o = data.vectorStroke;
        layerStyles.border = `${o.strokeStyleLineWidth.value}px solid ${toRGBa(o.strokeStyleContent['Clr '], o.strokeStyleOpacity.value)/100}`;
      }

      if (data.vectorOrigination) {
        const o = data.vectorOrigination.keyDescriptorList[0].keyOriginRRectRadii;
        if (curr) {
          const bdrd = [
            Math.round(curr.topLeft.value),
            Math.round(curr.topRight.value),
            Math.round(curr.bottomLeft.value),
            Math.round(curr.bottomRight.value),
          ];

          layerStyles.borderRadius = bdrd.join('px ');
      }

      /**
			 * Susidedam teksto stilius
			 */
      if (data.typeTool && data.node.text) {

        const font = data.node.text.font,
          fontFamily = font.name,
          colors = font.colors[0].pop(),
          color = `rgb(${font.colors[0].join(', ')})`,
          transY = data.node.text.transform.yy,
          fontSize = Math.round((font.sizes[0] * transY) * 100) * 0.01;

        if (data.typeTool.Leading) {
          var lineHeight = data['typeTool'].Leading[0];
          lineHeight = Math.round((lineHeight * transY) * 100) * 0.01;
        }

        var fontWeightNames = {
          "thin": 100,
          "extralight": 200,
          "ultralight": 200,
          "light": 300,
          "book": 400,
          "normal": 400,
          "regular": 400,
          "roman": 400,
          "medium": 500,
          "semibold": 600,
          "demibold": 600,
          "bold": 700,
          "extrabold": 800,
          "ultrabold": 800,
          "black": 900,
          "heavy": 900
        };

        var ff = fontFamily.split('-');

        if (ff.length > 1) {

          var fontWeight = fontWeightNames[ff[ff.length - 1].toLowerCase()];
        }

        if (typeof fontWeight !== 'undefined') {

          ff.pop();
        }

        var textStyles = {
          fontFamily: ff.join(' '),
          color: color,
          fontSize: fontSize,
          text: data['node'].text.value.replace(/\n/g, " ")
        };

        if (typeof lineHeight !== 'undefined') {

          textStyles.lineHeight = lineHeight;
        }

        if (typeof fontWeight !== 'undefined') {

          textStyles.fontWeight = fontWeight;
        }

        // text-transform - uppercase
        var fontCaps = data['typeTool'].FontCaps;
        if (typeof fontCaps !== 'undefined' && fontCaps[0] === 2) {

          textStyles.textTransform = 'uppercase';
        }

        var layerStyles = Object.assign(layerStyles, textStyles);
      }

      if (typeof data['objectEffects'] !== 'undefined') {

        var layerStyles = Object.assign(layerStyles, parseObjectEffects(data['objectEffects']));

        if (typeof data['node'].text !== 'undefined' && typeof layerStyles.dropShadow !== 'undefined') {

          layerStyles.textShadow = layerStyles.dropShadow;
        } else if (typeof layerStyles.dropShadow !== 'undefined') {

          layerStyles.boxShadow = layerStyles.dropShadow;
        }

        delete layerStyles.dropShadow;
      }

      if (typeof data['solidColor'] !== 'undefined') {

        var backgroundColor = 'rgb(' + data['solidColor'].join(', ') + ')';

        layerStyles.backgroundColor = backgroundColor;
      }

      layerStyles.tooltipX = this.offsetLefPsdObjectt;
      layerStyles.tooltipY = this.offsetTop;

      self.updateNotification(layerStyles);
    };

    /**
		 * Susidam ivairius efektus
		 * Ju gal bus daugiau, bet dabar pagrinde dropShadow ir gradient
		 */

    var parseObjectEffects = function(objectEffects) {

      var response = {};

      // drop shadow
      var ds = objectEffects['DrSh'];
      if (typeof ds !== 'undefined') {

        var color = constructRGBa(ds["Clr "], (ds['Opct'].value / 100));

        var angle = ds['lagl'].value;
        var distance = ds['Dstn'].value;

        var x = distance * Math.cos(angle);
        var y = distance * Math.sin(angle);

        var dropShadow = x + 'px ' + y + 'px ' + ds['blur'].value + 'px ' + ds['Ckmt'].value + 'px ' + color;

        response.dropShadow = dropShadow;
      }

      // bandom issiparsingti gradienta
      // jeigu pavyks, busiu herojus :D
      var gf = objectEffects['GrFl'];
      if (typeof gf !== 'undefined') {

        // background: linear-gradient(direction, color-stop1, color-stop2, ...);
        var angle = gf['Angl'].value + 90;

        var stops = [];

        for (var i = 0; i < gf['Grad']['Clrs'].length; i++) {

          var curr = gf['Grad']['Clrs'][i];
          var currTrns = gf['Grad']['Trns'][i];

          var color = constructRGBa(curr["Clr "], currTrns['Opct'].value / 100);
          stops.push(color);
        }

        var stopsStrin = stops.join(', ');
        var linearGradient = 'linear-gradient(' + angle + 'deg ' + ', ' + stopsStrin + ')';

        response.linearGradient = linearGradient;
      }

      return response;
    };

    // issivalom
    //this.objects.innerHTML = '';
    //this.createNotification();

    Styles.reverse().forEach((d) => {
      switch (d.node.type) {
        case 'layer':
          {
            const o = new PsdObject({
              class: 'obj',
              object: d,
              style: {
                width : `${toPercentageX(d.node.width)}%`,
                height : `${toPercentageY(d.node.height)}%`,
                top : `${toPercentageY(d.node.top)}%`,
                left : `${toPercentageX(d.node.left)}%`
              },
              onClick: object => handleObjClick(object)
            });

            this.refs.objects.appendChild(o.element);
          }
          break;

        case 'group':
        default:
          console.log(d.node.type);
          break;
      }
    });
  }

  parseFile(pathToFile, cb = () => {}) {
    if (fs.existsSync(`${cacheDir}/${this.imageHash}.png`)) {
      cb(require(`${cacheDir}/${this.imageHash}.json`));
      return;
    }

    const psd = PSD.fromFile(pathToFile);
    psd.parse();

    const extractedData = psd.tree().descendants().map((node) => {
      const getter = (k) => (node.get(k) || {
        data: undefined,
        export: () => ({}),
        styles: () => ({}),
        color: () => ({})
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
    fs.writeFileSync(`${cacheDir}/${this.imageHash}.json`, JSON.stringify(extractedData));
    psd.image.saveAsPng(`${cacheDir}/${this.imageHash}.png`).then(() => cb(extractedData));
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElemento() {
    return this.element;
  }

  updateNotification(data) {

    this.notification.style.top = (data.tooltipY) + 'px';
    this.notification.style.left = (data.tooltipX + data.width * 0.5) + 'px';

    var actprops = this.notification.querySelectorAll('.active');

    for (var i = 0; i < actprops.length; i++) {

      actprops[i].classList.remove('active');
    }

    var rulesTexts = {
      blendingMode: {
        prefix: 'Blending mode: ',
        suffix: ''
      },
      width: {
        prefix: 'width: ',
        suffix: 'px;'
      },
      height: {
        prefix: 'height: ',
        suffix: 'px;'
      },
      top: {
        prefix: 'top: ',
        suffix: 'px;'
      },
      left: {
        prefix: 'left: ',
        suffix: 'px;'
      },
      opacity: {
        prefix: 'opacity: ',
        suffix: ';'
      },
      name: {
        prefix: 'Layer name: ',
        suffix: ''
      },
      fontFamily: {
        prefix: 'font-family: ',
        suffix: ';'
      },
      color: {
        prefix: 'color: ',
        suffix: ';'
      },
      fontSize: {
        prefix: 'font-size: ',
        suffix: 'px;'
      },
      lineHeight: {
        prefix: 'line-height: ',
        suffix: 'px;'
      },
      textShadow: {
        prefix: 'text-shadow: ',
        suffix: ';'
      },
      text: {
        prefix: 'Text: ',
        suffix: ''
      },
      backgroundColor: {
        prefix: 'background-color: ',
        suffix: ';'
      },
      linearGradient: {
        prefix: 'linear-gradient: ',
        suffix: ';'
      },
      boxShadow: {
        prefix: 'box-shadow: ',
        suffix: ';'
      },
      border: {
        prefix: 'border: ',
        suffix: ';'
      },
      borderRadius: {
        prefix: 'border-radius: ',
        suffix: ';'
      },
      textTransform: {
        prefix: 'text-transform: ',
        suffix: ';'
      },
      fontWeight: {
        prefix: 'font-weight: ',
        suffix: ';'
      }
    };

    for (var prop in data) {

      if (typeof this.notification[prop] !== 'undefined') {

        if (typeof rulesTexts[prop] !== 'undefined') {

          this.notification[prop].innerHTML = rulesTexts[prop].prefix + data[prop] + rulesTexts[prop].suffix;
        } else {

          this.notification[prop].innerHTML = data[prop];
        }

        this.notification[prop].classList.add('active');
      }
    }

  }

}
