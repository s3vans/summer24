let game;

function preload() {
  config = {}
  config.consts = {};
  config.consts.xResolution = 800;
  config.consts.yResolution = 600;
  config.consts.minScaleFactor = .5;
  config.consts.maxScaleFactor = 3;
  //configHelper.expandGameConfig(gameConfig);
  game = new Game(config);
}

function setup() {
  game.setup();
}

function draw() {
  let deltaT = deltaTime;
  game.update(deltaT);
  game.draw(deltaT);
}

function mouseClicked() {
  game.mouseClicked();
}

function windowResized() {
  game.windowResized();
}

function touchEnded() {
  mouseClicked();
  return false;
}
