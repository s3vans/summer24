class ConfigHelper {
  constructor() { };

  _expandAnimationConfig(animationConfig, defaultAnimationConfig) {
    let config = animationConfig;
    let defaultConfig = defaultAnimationConfig;

    let path = helper.getFieldDefaultConfig("path", config, defaultConfig);
    animationConfig.path = path;

    animationConfig.frameHeight =
        helper.getFieldDefaultConfig("frameHeight", config, defaultConfig);

    animationConfig.fps =
        helper.getFieldDefaultConfig("fps", config, defaultConfig);

    animationConfig.isLooping =
        helper.getFieldDefaultConfig("isLooping", config, defaultConfig);
    if (isLooping == null) {
      return null;
    }

    animationConfig.img = null;
    helper.asyncLoadImageFromPath(path)
        .then((img) => {
          //console.log("Loaded " + path);
          animationConfig.img = img;
        })
        .catch((err) => {
          //console.log("Error loading " + path);
          //console.log(err);
          animationConfig.img = null;
        });
  }

  _expandFighterConfig(expandedGameConfig, rootDir, uid, fighterConfig) {
    fighterConfig.consts = {};
    fighterConfig.consts.defaultFrameHeight = 133;
    fighterConfig.consts.defaultFps = 12;
    fighterConfig.consts.defaultIsLooping = true;

    if (fighterConfig.name == undefined) {
      fighterConfig.name = uid;
    }

    if (fighterConfig.imgs == undefined) {
      fighterConfig.imgs = {};
    }
    let defaultAnimationConfig = {
      "frameHeight": fighterConfig.consts.defaultFrameHeight,
      "fps": fighterConfig.consts.defaultFps,
      "isLooping": fighterConfig.consts.defaultIsLooping,
    }
    let modes = ["standing"];
    for (let mode of modes) {
      helper.expandAssetPath(fighterConfig.imgs, mode, rootDir, uid, "png");
      // NOTE: loadAnimationFromConfig() updates the |img| value asynchronously
      // after the image loads or fails to load.
      this._expandAnimationConfig(fighterConfig.imgs[mode],
                                  defaultAnimationConfig);
    }

    if (fighterConfig.mp3s == undefined) {
      fighterConfig.mp3s = {};
    }
    modes = [];
    for (let mode of modes) {
      helper.expandAssetPath(fighterConfig.mp3s, mode, rootDir, uid, "mp3");
      helper.loadMp3FromPath(fighterConfig.mp3s[mode],
                             fighterConfig.mp3s[mode].path);
    }
  }

  _expandArenaConfig(expandedGameConfig, rootDir, arenaConfig) {
    arenaConfig.consts = {};
    arenaConfig.consts.defaultStartingMoney = 0;
    arenaConfig.consts.defaultFrameHeight =
        expandedGameConfig.consts.yResolution;
    arenaConfig.consts.defaultFps = 6;
    arenaConfig.consts.defaultIsLooping = true;

    let uid = helper.getField("uid", arenaConfig);
    if (uid == null) {
      console.log("Arena config is missing required uid.");
      return null;
    }

    if (arenaConfig.startingMoney == undefined) {
      arenaConfig.startingMoney = arenaConfig.consts.defaultStartingMoney;
    }

    if (arenaConfig.imgs == undefined) {
      arenaConfig.imgs = {};
    }
    helper.expandAssetPath(arenaConfig.imgs, "background", rootDir, uid, "png");
    let defaultAnimationConfig = {
      "frameHeight": arenaConfig.consts.defaultFrameHeight,
      "fps": arenaConfig.consts.defaultFps,
      "isLooping": arenaConfig.consts.defaultIsLooping,
    }
    // NOTE: loadAnimationFromConfig() updates the |img| value asynchronously
    // after the image loads or fails to load.
    this._expandAnimationConfig(arenaConfig.imgs.background,
                                defaultAnimationConfig);

    if (arenaConfig.mp3s == undefined) {
      arenaConfig.mp3s = {};
    }
    let modes = ["background"];
    for (let mode of modes) {
      helper.expandAssetPath(arenaConfig.mp3s, mode, rootDir, uid, "mp3");
      helper.loadMp3FromPath(arenaConfig.mp3s[mode],
                             arenaConfig.mp3s[mode].path);
    }
  }

  // Must be called from preload() so that p5js library is loaded.
  expandGameConfig(gameConfig) {
    gameConfig.consts = {};
    gameConfig.consts.xResolution = 800;
    gameConfig.consts.yResolution = 600;
    gameConfig.consts.minScaleFactor = .5;
    gameConfig.consts.maxScaleFactor = 3;
    gameConfig.consts.defaultFrameHeight = gameConfig.consts.yResolution;
    gameConfig.consts.defaultFps = 6;
    gameConfig.consts.defaultIsLooping = true;

    let rootDir = "";
    if (gameConfig.rootDir != undefined) {
      rootDir = gameConfig.rootDir;
    }

    if (gameConfig.imgs == undefined) {
      gameConfig.imgs = {};
    }
    let defaultAnimationConfig = {
      "frameHeight": gameConfig.consts.defaultFrameHeight,
      "fps": gameConfig.consts.defaultFps,
      "isLooping": gameConfig.consts.defaultIsLooping,
    }

    if (gameConfig.fighters == undefined) {
      gameConfig.fighters = {};
    }
    for (let [uid, fighterConfig] of Object.entries(gameConfig.fighters)) {
      this._expandFighterConfig(gameConfig, rootDir, uid, fighterConfig);
    }

    if (gameConfig.arenas == undefined) {
      gameConfig.arenas = [];
    }
    for (let arena of gameConfig.arenas) {
      this._expandArenaConfig(gameConfig, rootDir, arena);
    }
  }
}

let configHelper = new ConfigHelper();
