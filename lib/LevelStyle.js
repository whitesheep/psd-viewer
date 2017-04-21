/** @babel */
/** @jsx etch.dom */

import etch from 'etch';

const rulesTexts = {
  width: {
    prefix: 'width',
    suffix: 'px;'
  },
  height: {
    prefix: 'height',
    suffix: 'px;'
  },
  top: {
    prefix: 'top',
    suffix: 'px;'
  },
  left: {
    prefix: 'left',
    suffix: 'px;'
  },
  opacity: {
    prefix: 'opacity',
    suffix: ';'
  },
  fontFamily: {
    prefix: 'font-family',
    suffix: ';'
  },
  color: {
    prefix: 'color',
    suffix: ';'
  },
  fontSize: {
    prefix: 'font-size',
    suffix: 'px;'
  },
  lineHeight: {
    prefix: 'line-height',
    suffix: 'px;'
  },
  textShadow: {
    prefix: 'text-shadow',
    suffix: ';'
  },
  backgroundColor: {
    prefix: 'background-color',
    suffix: ';'
  },
  linearGradient: {
    prefix: 'linear-gradient',
    suffix: ';'
  },
  boxShadow: {
    prefix: 'box-shadow',
    suffix: ';'
  },
  border: {
    prefix: 'border',
    suffix: ';'
  },
  borderRadius: {
    prefix: 'border-radius',
    suffix: ';'
  },
  textTransform: {
    prefix: 'text-transform',
    suffix: ';'
  },
  fontWeight: {
    prefix: 'font-weight',
    suffix: ';'
  }
};

export default class LevelStyle {
  constructor(props) {
    this.props = props;
    this._list = [];
    etch.initialize(this);
  }

  async update(props) {
    Object.assign(this.props, props);
    return etch.update(this);
  }

  destroy() {
    return etch.destroy(this);
  }

  render() {
    this._list = Object.keys(this.props.styles).map(s => {
      if (rulesTexts[s] && this.props.styles[s]) {
        return (
          <li ref='listElement'>
            <span className='styleName'>{rulesTexts[s].prefix}</span><span className='styleValue'>{`${this.props.styles[s]}${rulesTexts[s].suffix}`}</span>
          </li>
        );
      } else {
        return null;
      }
    }).filter(d => !!d);


    return (
      <div className='levelStyle' ref='levelStyle'>
        <span>{this.props.id}</span>
        <ul>
          {this._list}
        </ul>
      </div>
    );
  }
}

class SingleStyle {
  constructor(props) {
    this.props = props;
    etch.initialize(this);
  }

  update(props) {
    Object.assign(this.props, props);
  }

  destroy() {
    this.refs.listElement.remove();
    return etch.destroy(this);
  }

  render() {
    return (
      <li ref='listElement'>
        <span className='styleName'>{rulesTexts[this.props.name].prefix}</span>:<span className='styleValue'>{`${this.props.value}${rulesTexts[this.props.name].suffix}`}</span>
      </li>
    );
  }
}
