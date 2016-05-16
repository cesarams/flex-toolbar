'use babel';

import fs from 'fs';
import path from 'path';

export default class FlexToolBar {
  constructor (toolBar) {
    this.toolBar = toolBar;
    this.buttonInstances = [];

    this._getConfigfilePath().then((configFilepath) => {
      this.configFilepath = configFilepath;
      return configFilepath;
    }).then((configFilepath) => {
      return this.loadConfigfile(configFilepath);
    }).then((toolbarConfig) => {
      this.addButtons(toolbarConfig);
      this.setupButtonStyle();
    }).catch((err) => {
      // generate configfile
      if (err) {
        this.notify('Error', 'flex-tool-bar Error.', {
          detail: err
        });
      }
    });
  }

  loadConfigfile (configfilePath) {
    if (configfilePath.indexOf('.cson')) {
      // toolbar.cson
      const CSON = require('season');
      return CSON.readFileSync(configfilePath);
    } else {
      require('json5/lib/require');
      return require(configfilePath);
      // toolbar.json OR toolbar.json5
    }
  }

  _getConfigfilePath () {
    const configFileTypes = ['.cson', 'json', 'json5'];

    return new Promise((resolve, reject) => {
      let toolBarConfigPath = this._getAtomConfig('toolBarConfigurationFilePath');

      if (!toolBarConfigPath) {
        reject();
      }

      if (configFileTypes.indexOf(path.extname(toolBarConfigPath)) >= 0
      ) {
        return resolve(toolBarConfigPath);
      }

      Promise.all(configFileTypes.map((ext) => {
        return this._checkFileExists(path.join(toolBarConfigPath, `toolbar${ext}`));
      })).then((results) => {
        const filepath = results.find((filepath) => {
          if (filepath !== null) {
            return filepath;
          }
        });

        if (filepath) {
          resolve(filepath);
        } else {
          reject();
        }
      });
    });

    // if (fs.resolve(toolBarConfigPath, 'toolbar', configFileTypes);
  }

  _checkFileExists (filepath) {
    return new Promise((resolve) => {
      fs.access(filepath, (err) => {
        if (err) {
          resolve(null);
        }

        resolve(filepath);
      });
    });
  }

  generateDefaultConfigFile (body) {
    // let configPath = this._getAtomConfig();
  }

  addButtons (buttons) {
    buttons.forEach((button) => {
      this.buttonInstances.push(this.toolBar.addButton(button));
    });
  }

  setupButtonStyle () {
    this.buttonInstances.forEach((button) => {
      if (button.options.style) {
        Object.keys(button.options.style).forEach((key) => {
          button.element.style[key] = button.options.style[key];
        });
      }
    });
  }

  _getAtomHomePath () {
    return process.env.ATOM_HOME;
  }

  _getAtomConfig (key) {
    return atom.config.get(`flex-tool-bar.${key}`);
  }

  notify (type, message, options = {}) {
    atom.notifications[`add${type}`](message, options);
  }
}
