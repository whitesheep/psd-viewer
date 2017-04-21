/** @babel */
/** @jsx etch.dom */

export default class LevelsTree {
  constructor(props) {
    this.props = props;
    etch.initialize(this);

    this.refs.clickfolder.addEventListener('click', (e) => this._click(e));

    //CollapsibleLists.applyTo(this.refs.collapsibleList);
  }

  _click(e){
    this.refs.clickfolder.classList.toggle('extended');
    this.refs.clickfolder.classList.toggle('collapsed');
    e.preventDefault();
  }

  update() {}

  render() {
    return (
      <div className='levelsTree' ref='levelsTree'>
        <ol ref='tree' className='archive-tree padded list-tree has-collapsable-children'>
          <li ref='clickfolder' className='list-nested-item entry'>
            <span className='list-item'>
              <span className='directory icon icon-file-directory'>
                Directory Test
              </span>
            </span>

            <ol className='list-tree'>
              <li className='list-nested-item entry'>
                <span className='list-item'>
                  <span className='directory icon icon-file-directory'>
                    Directory Test
                  </span>
                </span>

                <ol className='list-tree'></ol>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    );
  }
}
