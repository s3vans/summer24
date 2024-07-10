class Helper {
  constructor() { }

  mouseInRectangle(scaledMouseX, scaledMouseY, x, y, width, height) {
    let mX = scaledMouseX;
    let mY = scaledMouseY;
    if (mX < x || mX > x+width) {
      return false;
    }
    if (mY < y || mY > y+height) {
      return false;
    }
    return true;
  }

  highlightRectangle(x, y, width, height, color, transparency) {
    push();
    fill(color);
    rect(x, y, width, height);
    pop();
  }

  removeFromArray(arr, elem) {
    const index = arr.indexOf(elem);
    if (index != -1) {
      arr.splice(index, 1);
    }
  }
  
  // Create config.<key> object if it doesn't exist, populate config.<key>.path
  // with "<rootDir>/<uid>_<path>.<ext>" if it doesn't exist, else expand
  // config.<key>.path to "<rootDir>/<config.<key>.path>" if it exists.
  expandAssetPath(config, key, rootDir, uid, ext) {
    if (config[key] == undefined) {
      config[key] = {};
    }
    if (config[key].path == undefined) {
      config[key].path = rootDir + '/' + uid + '_' + key + "." +  ext;
    } else {
      config[key].path = rootDir + '/' + config[key].path;
    }
  }
  
  // Return the value of |fieldId| in |config| if defined, else |defaultValue|
  // if defined, else returns `null`.
  getField(fieldId, config, defaultValue) {
    let result = null;
    if (defaultValue != undefined) {
      result = defaultValue;
    }
    if (config[fieldId] != undefined) {
      result = config[fieldId];
    }
    return result;
  }
  
  // Return the value of |fieldId| in |config| if defined, else the value from
  // |defaultConfig| if defined, else returns `null`.
  getFieldDefaultConfig(fieldId, config, defaultConfig) {
    let result = null;
    if (defaultConfig != undefined) {
      if (defaultConfig[fieldId] != undefined) {
        result = defaultConfig[fieldId];
      }
    }
    if (config[fieldId] != undefined) {
      result = config[fieldId];
    }
    return result;
  }
  
  // Return a promise while we asynchronously load the p5.Image at |path| if it
  // is available, and return it via the resolve() callback, else return `null`
  // via the reject() callback. Must be called from preload() so that p5js
  // library is loaded.
  asyncLoadImageFromPath(path) {
    return new Promise((resolve, reject) => {
      loadImage(
          path,
          img => { resolve(img); return img; },
          event => { reject(event); return null; });
    });
  }

  // If the mp3 file at |path| exists, load it in |mp3Config.mp3|. Must be
  // called during preload() to work properly.
  loadMp3FromPath(mp3Config, path) {
    var http = new XMLHttpRequest();
    http.open('HEAD', path, false);
    http.send();
    if (http.status == 200) {
      mp3Config.mp3 = loadSound(path);
    }
  }

  // Used before playing to override hardcoded defaults
  // Only used for subset of level.js and game.js sounds now.
  overrideVolume(mp3Config) {
    if (mp3Config.volume != undefined) {
      mp3Config.mp3.setVolume(mp3Config.volume);
    }
  }
}

let helper = new Helper();

