'use babel';

import path from 'path';
import PsdExtractView from './psd-viewer-view';
import {CompositeDisposable} from 'atom';

function openURI(uriToOpen) {
  if (path.extname(uriToOpen).toLowerCase() === '.psd') {
    return new PsdExtractView(uriToOpen);
  }
}

export default {

  activate(state) {
    this.statusViewAttached = null
    this.disposables = new CompositeDisposable();
    this.disposables.add(atom.workspace.addOpener(openURI));
  },

  deactivate() {
    this.subscriptions.dispose();
  }
};
