/** @babel */
/** @jsx etch.dom */

/**
 * TODO:
 *  visuzlizzazioni,
 *  drag & drop,  fatto
 *  hover -> visualizzazione nome livello, fatto
 *  aggiungere loader,
 *  click livello, evidenziato permanent con livello giusto
 */
import os from 'os';
import fs from 'fs';
import etch from 'etch';
import Draggabilly from 'draggabilly';
import PsdObject from './PsdObject';
import PsdParser from './PsdParser';
import LevelsTree from './LevelsTree';
import LevelStyle from './LevelStyle';

const dateNow = new Date(),
  cacheDir = `${os.tmpdir()}/atom-psd-viewer-${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`;

export default class PsdExtractView {

  constructor(uri) {
    etch.initialize(this);

    this._draggie = new Draggabilly(this.refs.psdZoomable, {
      // options...
    });

    try {
      fs.mkdirSync(cacheDir);
    } catch (e) {}

    this._uri = uri;
    this._parser = new PsdParser(uri, cacheDir);


    //this.parseFile(uri, (s) => this.showPreview(s));

    this._parser.parse().then(s => this.showPreview(s));

    this._zoom = 100;
    this.refs.zoomOutButton.addEventListener('click', () => this.setZoom(-10));
    this.refs.zoomInButton.addEventListener('click', () => this.setZoom(+ 10));
  }

  serialize() {}

  // Tear down any state and detach
  destroy() {
    etch.destroy(this);
  }

  showPreview(Styles) {
    this.refs.psdImage.src = `${cacheDir}/${this._parser._imageHash}.png`;
    this.refs.psdImage.onload = () => this.createObjects(Styles);
  }

  setZoom(r) {
    this._zoom = Math.min(Math.max(this._zoom + r, 1), 500);
    //this.refs.psdZoomable.style.transform = `scaleX(${this._zoom / 100}) scaleY(${this._zoom / 100})`;
    this.refs.psdImage.style.transform = `scaleX(${this._zoom / 100}) scaleY(${this._zoom / 100})`;
    this.refs.objects.style.transform = `scaleX(${this._zoom / 100}) scaleY(${this._zoom / 100})`;
  }

  update(...args) {
  }

  getTitle() {
    return this._uri;
  }

  objectsOver() {
    this.refs.objectOver.style.display = 'block';
  }

  objectsOut() {
    this.refs.objectOver.style.display = 'none';
  }

  objectsMove(e) {

    // https://gist.github.com/electricg/4435259

    function mousePositionDocument(e) {
      let posx = 0,
        posy = 0;

      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      return {x: posx, y: posy};
    }

    function findPos(obj) {
      let curleft = 0,
        curtop = 0;

      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
      }

      return {left: curleft, top: curtop};
    }

    const mousePosDoc = mousePositionDocument(e),
      targetPos = findPos(this.refs.psdZoomable),
      posx = mousePosDoc.x - targetPos.left,
      posy = mousePosDoc.y - targetPos.top;

    this.refs.objectOver.style.top = `${posy + 5}px`;
    this.refs.objectOver.style.left = `${posx + 5}px`;
  }

  render() {
    return (
      <div className='psdViewer' tabIndex='-1'>
        <div className='psdContainer' background='white' ref='psdContainer'>
          <div className='psdZoomable' ref='psdZoomable' onMouseOver={() => this.objectsOver()} onMouseOut={() => this.objectsOut()} onMouseMove={e => this.objectsMove(e)}>
            <img className='psdImage' ref='psdImage'></img>
            <div className='objects' ref='objects'></div>
            <div className='objectOver' ref='objectOver'>
              <span ref='objectName'></span>
            </div>
          </div>
        </div>
        <div className='psdBar' ref='psdBar'>
          <div className='zoomMenu'>
            <button className='btn' ref='zoomOutButton'>-</button>
            <button className='btn' ref='zoomInButton'>+</button>
          </div>
          {/*<LevelsTree/>*/}
          <LevelStyle ref='levelStyle' id='' styles={{}}/>
          {/*
              fare più elementi

              aggiungere visualizzazione
                - livelli
                - stili
            */}
        </div>
      </div>
    )
  }

  createObjects(Styles) {
    const toPercentageX = pixels => pixels * 100 / this.refs.psdImage.naturalWidth,
      toPercentageY = pixels => pixels * 100 / this.refs.psdImage.naturalHeight;

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
              onClick: (object) => {
                const p = this._parser.parseObject(object);
                this.refs.levelStyle.update({styles: p, id: d.id});
              },
              onMouseMove: (object) => {
                this.refs.objectName.textContent = object.node.name;
              }
            });

            this.refs.objects.appendChild(o.element);
            //this.refs.psdBar.appendChild(d.png);
          }
          break;

        case 'group':
        default:
          //console.log(d.node.type);
          break;
      }
    });
  }
}
