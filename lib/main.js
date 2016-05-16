'use babel';

import FlexToolBar from './flex-tool-bar';

let toolBar;
let flexToolBar;

export const config = {
  toolBarConfigurationFilePath: {
    type: 'string',
    default: `${process.env.ATOM_HOME}/`
  },
  reloadToolBarWhenEditConfigFile: {
    type: 'boolean',
    default: true
  },
  useBrowserPlusWhenItIsActive: {
    type: 'boolean',
    default: false
  }
};

export function consumeToolBar (getToolBar) {
  toolBar = getToolBar('flex-tool-bar');
  flexToolBar = new FlexToolBar(toolBar);
}

export function deactivate () {
  if (flexToolBar) {
    flexToolBar = null;
  }

  if (toolBar) {
    toolBar.removeItems();
    toolBar = null;
  }
}
