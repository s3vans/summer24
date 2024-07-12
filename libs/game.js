class Game {
  constructor(expandedGameConfig) {
    this.config = expandedGameConfig;
    this.state = {};
    // Used to execute code once on the first update.
    this.state.firstUpdate = true;
 
    this.state.lastFrameTime = 0;
    this.state.elapsedTime = 0;

    this.resetState();
    this.state.gameState = "PREGAME";
  }

  resetState() {
    this.state.scaleFactor = 1;
    this._updateScaleFactor();
    this.state.sequenceNum = 0;
    this.state.lastEventTime = Date.now();
    this.state.waitTime = 0;
  }

  debug(...args) {
    const DEBUG = 1;
    if (DEBUG) {
      console.log(...args);
    }
  }

  _updateScaleFactor() {
    const xRes = this.config.consts.xResolution;
    const yRes = this.config.consts.yResolution;
    const minScaleFactor = this.config.consts.minScaleFactor;
    const maxScaleFactor = this.config.consts.maxScaleFactor;

    const xFactor = Math.max(windowWidth / xRes, minScaleFactor);
    const yFactor = Math.max(windowHeight / yRes, minScaleFactor);
    const smallerFactor = Math.min(yFactor, xFactor);
    this.state.scaleFactor = Math.min(smallerFactor, maxScaleFactor);
  }

  _getScaledResolution() {
    this._updateScaleFactor();
    const scaledResX = this.config.consts.xResolution * this.state.scaleFactor;
    const scaledResY = this.config.consts.yResolution * this.state.scaleFactor;
    return [scaledResX, scaledResY];
  }

  setup() {
    const [scaledResX, scaledResY] = this._getScaledResolution();
    createCanvas(scaledResX, scaledResY);
  }

  // A low pass filter to catch long gaps caused by navigating away from the
  // tab. I found that deltaT would be large for multiple frames after
  // restoring the tab, so I filter on that too.
  _ignoreVeryLongFrames(deltaT) {
    let now = new Date();
    let last_time = this.state.lastFrameTime;
    let elapsed = now - last_time;
    this.state.lastFrameTime = now;
    if (elapsed > 100 || deltaT > 100) {
      return true;
    }
    this.state.elapsedTime += elapsed;
    return false;
  }

  update(deltaT) {
    if (this._ignoreVeryLongFrames(deltaT)) {
      return;
    }

    // Added a PREGAME state because sound can't play until first click.
    if (this.state.gameState == "PREGAME") {
      return;
    }

    if (this.state.firstUpdate) {
      // Do first time stuff.
      this.animations = [];
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.walk_forward));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.walk_backward));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.standing));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.standing_punch));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.standing_kick));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.standing_block));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.standing_hit));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.upper_cut));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.spinkick));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.spinkick_blocked));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.leg_sweep));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.ducking));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.ducking_kick));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.ducking_block));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.ducking_hit));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.jumping_up));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.jumping_around));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.jumping_punch));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.jumping_kick));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.falling_back));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.falling_sweep));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.hopping_up));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.special));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.dizzy));
      this.animations.push(loadAnimationFromConfig(this.config.fighters.subzero.imgs.victory));
      this.curr_animation = 0;
      this.state.firstUpdate = false;
    }

    // FIXME: Remove this example of event timing in the main game loop.
    //let sequence = this.config.levels[this.state.currentLevelIndex].sequence;
    //let now = Date.now();
    //let elapsed = now - this.state.lastEventTime;
    //if (elapsed > this.state.waitTime) {
    //  while (this.state.sequenceNum < sequence.length) {
    //    let [ command, arg1, arg2, arg3 ] = sequence[this.state.sequenceNum];
    //    this.debug("Read command", command, arg1, arg2, arg3);
    //    if (command == "wait") {
    //      let duration = arg1;
    //      this.debug("Waiting for", duration, "milliseconds");
    //      this.state.lastEventTime = now;
    //      this.state.waitTime = duration;
    //      this.state.sequenceNum++;
    //      break;
    //    }
    //    else if (command == "attack") {
    //      // Example 'attack' command.
    //      this.state.sequenceNum++;
    //    }
    //  }
    //}

    let curr = this.curr_animation % this.animations.length;
    this.animations[curr].update();
  }

  _scaleMouse(pos) {
    return pos / this.state.scaleFactor;
  }

  _drawPregame() {
    let xRes = this.config.consts.xResolution;
    let yRes = this.config.consts.yResolution;
    push();
    background(0);
    textFont("Helvetica");
    textAlign(CENTER, CENTER);
    strokeWeight(1); stroke(255); fill(255);
    textSize(25);
    text('Click to start...', xRes/2, yRes/2);
    pop();
  }

  draw(deltaT) {
    // FYI: setInterval() doesn't pause when navigating to another tab, but the
    // draw() loop (based on RequestNextFrame()) does pause.
    // https://www.reddit.com/r/p5js/comments/10p0oe8/code_only_runs_when_browser_tab_is_focused/?rdt=56261

    scale(this.state.scaleFactor);
    const scaledMouseX = this._scaleMouse(mouseX);
    const scaledMouseY = this._scaleMouse(mouseY);

    // Added a PREGAME state because sound can't play until first click.
    if (this.state.gameState == "PREGAME") {
      this._drawPregame();
      return;
    }

    background(100);

    // This is setup to calibrate ~133px tall fighters.
    let calibration_mode = true;
    if (calibration_mode) {
      push();
      fill(255, 255, 255);
      line(0, 100, width, 100);
      line(0, 233, width, 233);
      circle(110, 233, 10);
      circle(155, 233, 10);
      let curr = this.curr_animation % this.animations.length;
      if (this.animations[curr] != null) {
        let scaledMouseX = this._scaleMouse(mouseX);
        let scaledMouseY = this._scaleMouse(mouseY);
        //this.animations[curr].draw(scaledMouseX+30, scaledMouseY+30);
        this.animations[curr].draw(100, 100);
      }
      pop();
    }

    // ...
  }

  // Debounce mouse clicks within 30ms. We treat 'touch ended' as a mouse
  // click, which resulted in two clicks without this debounce.
  // Returns true if debounced, else false.
  _debounceClick() {
    const now = new Date().getTime();
    if (now <= this.state.lastClickTime + 30) {
      return true;
    }
    this.state.lastClickTime = now;
    return false;
  }

  // In NORMAL and SELECTED states, we always handle collectible clicks,
  // followed by character selection changes. Only in SELECTED do we handle
  // placing a character on the map.
  mouseClicked() {
    if (this._debounceClick()) {
      return;
    }

    // Without this check, the game was crashing while processing clicks before
    // the first level was loaded.
    if (this.state == undefined) {
      return;
    }

    // Added a PREGAME state because sound can't play until first click.
    if (this.state.gameState == "PREGAME") {
      this.state.gameState = "MENU";
      return;
    }

    let curr = this.curr_animation % this.animations.length;
    this.animations[curr].reset();
    this.curr_animation++;
    return;
  }

  windowResized() {
    const [scaledResX, scaledResY] = this._getScaledResolution();
    resizeCanvas(scaledResX, scaledResY);
  }
}
