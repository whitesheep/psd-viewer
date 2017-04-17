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
import PsdObject from './PsdObject.js';
import PsdParser from './PsdParser';

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

  showPreview(Styles) {
    this.refs.psdImage.src = `${cacheDir}/${this.imageHash}.png`;
    this.refs.psdImage.onload = () => this.createObjects(Styles);
  }

  setZoom(r) {
    this._zoom = Math.min(Math.max(this._zoom + r, 1), 500);
    //this.refs.psdZoomable.style.transform = `scaleX(${this._zoom / 100}) scaleY(${this._zoom / 100})`;
    this.refs.psdImage.style.transform = `scaleX(${this._zoom / 100}) scaleY(${this._zoom / 100})`;
    this.refs.objects.style.transform = `scaleX(${this._zoom / 100}) scaleY(${this._zoom / 100})`;
  }

  update(...args) {
    console.log(args);
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

  render() {
    return (
      <div className='psdViewer' tabIndex='-1'>
        <div className='psdContainer' background='white' ref='psdContainer'>
          <div className='psdZoomable' ref='psdZoomable' onMouseOver={() => this.objectsOver()} onMouseOut={() => this.objectsOut()}>
            <img className='psdImage' ref='psdImage'></img>
            <div className='objects' ref='objects'></div>
          </div>
        </div>
        <div className='psdBar'>

          <button className='btn' ref='zoomOutButton'>-</button>
          <button className='btn reset-zoom-button' ref='resetZoomButton'>100%</button>
          <button className='btn' ref='zoomInButton'>+</button>

          {/*
              fare più elementi

              aggiungere visualizzazione
                - livelli
                - stili
            */}
        </div>
        <div className='objectOver' ref='objectOver'>
          <span ref='objectName'></span>
        </div>
      </div>
    )
  }

  createObjects(Styles) {
    const toPercentageX = pixels => pixels * 100 / this.refs.psdImage.naturalWidth,
      toPercentageY = pixels => pixels * 100 / this.refs.psdImage.naturalHeight;

    Styles.reverse().forEach((d) => {
      console.log(d);
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
                console.log(p);
              },
              onMouseMove: (event, object) => {
                this.refs.objectName.textContent = object.node.name;
                this.refs.objectOver.style.top = `${event.clientY - 20}px`;
                this.refs.objectOver.style.left = `${event.clientX - 200}px`;
              },
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

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  updateNotification(data) {
    return;
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
