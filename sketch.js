let game;

function preload() {
  //configHelper.expandGameConfig(pokemonGameConfig);
  //game = new Game(pokemonGameConfig);
}

function setup() {
  //game.setup();
}

function draw() {
  let deltaT = deltaTime;
  //game.update(deltaT);
  //game.draw(deltaT);
}

function mouseClicked() {
  //game.mouseClicked();
}

function windowResized() {
  //game.windowResized();
}

function touchEnded() {
  mouseClicked();
  return false;
}
