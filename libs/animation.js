// Assumes that animationConfig.img is already loaded.
function loadAnimationFromConfig(animationConfig, defaultAnimationConfig) {
  let config = animationConfig;
  let defaultConfig = defaultAnimationConfig;

  let path = helper.getFieldDefaultConfig("path", config, defaultConfig);
  if (path == null) {
    return null;
  }

  let frameHeight =
      helper.getFieldDefaultConfig("frameHeight", config, defaultConfig);
  if (frameHeight == null) {
    return null;
  }

  let fps =  helper.getFieldDefaultConfig("fps", config, defaultConfig);
  if (fps == null) {
    return null;
  }

  let isLooping = helper.getFieldDefaultConfig("isLooping", config,
                                               defaultConfig);
  if (isLooping == null) {
    return null;
  }

  adjustments = {}
  if (config.xOffset != undefined) {
    adjustments.xOffset = config.xOffset;
  }
  if (config.yOffset != undefined) {
    adjustments.yOffset = config.yOffset;
  }
  if (config.scaleOffset != undefined) {
    adjustments.scaleOffset = config.scaleOffset;
  }

  return new Animation(animationConfig.img, frameHeight, fps, isLooping,
                       adjustments);
}

class Animation {
  constructor(img, frameHeight, fps, isLooping, adjustments) {
    this.img = img;
    this.frameHeight = frameHeight;
    this.fps = fps;
    this.isLooping = isLooping;

    this.xOffset = 0;
    this.yOffset = 0;
    this.scaleOffset = 1;
    if (adjustments != undefined) {
      if (adjustments.xOffset != undefined) {
        this.xOffset = adjustments.xOffset;
      }
      if (adjustments.yOffset != undefined) {
        this.yOffset = adjustments.yOffset;
      }
      if (adjustments.scaleOffset != undefined) {
        this.scaleOffset = adjustments.scaleOffset;
      }
    }

    this.numFrames = null;
    this.lastFrameTime = null;
    this.msPerFrame = Math.floor(1000 / this.fps);
    this.currentFrameNum = 0;
    this.isDone = false;
  }

  reset() {
    this.lastFrameTime = null;
    this.currentFrameNum = 0;
    this.isDone = false;
  }

  update() {
    if (this.img == null) {
      return;
    }
    if (this.isDone) {
      return;
    }
    let nowMs = Date.now();
    if (this.numFrames === null) {
      this.numFrames = Math.floor(this.img.height / this.frameHeight);
    }
    if (this.lastFrameTime === null) {
      this.lastFrameTime = nowMs;
    }
    let timeSinceLastFrame = nowMs - this.lastFrameTime;
    let numFramesToAdvance = Math.floor(timeSinceLastFrame / this.msPerFrame);
    let nextFrame = (this.currentFrameNum + numFramesToAdvance) % this.numFrames;
    if ((!this.isLooping) && (nextFrame < this.currentFrameNum)) {
      nextFrame = this.numFrames - 1;
      this.isDone = true;
    }
    this.currentFrameNum =  nextFrame;
    if (numFramesToAdvance > 0) {
      this.lastFrameTime = nowMs;
    }
  }

  draw(x, y) {
    if (this.img == null) {
      return;
    }
    let srcX = 0;
    let srcY = this.frameHeight * this.currentFrameNum;
    let srcWidth = this.img.width;
    let srcHeight = this.frameHeight;

    // There is a lot of weirdness regarding drawing from a source image
    // related to a destination image with mismatched sizes. It doesn't stretch
    // and scale the image in the way I would have hoped.  I found it better to
    // draw the image at its original size, optionally scaled by a factor. The
    // COVER and LEFT, LEFT params are the closest to what I wanted, but there
    // is no STRETCH mode. This seems to work well enough.
    image(this.img, x+this.xOffset, y+this.yOffset,
          srcWidth*this.scaleOffset, srcHeight*this.scaleOffset,
          srcX, srcY, srcWidth, srcHeight, COVER, LEFT, LEFT);

    // This was some useful debugging code when the scaling wasn't WAI. It
    // shows the entire animation strip and the boundary box around what is
    // being displayed.
    let show_debug = false;
    if (show_debug) {
      image(this.img, 0, 0, srcWidth, this.img.height);
      strokeWeight(1);
      stroke(255, 0, 0);
      noFill();
      rect(srcX, srcY, srcWidth, srcHeight);
      console.log(this.frameHeight, this.currentFrameNum, srcX, srcY);
    }
  }
}
