class Fighter {
  constructor(fighterConfig) {
    this.config = fighterConfig;
    this.animations = {};
    this.animation = undefined;
    this.modes = [
        "walk_forward",
        "walk_backward",
        "standing",
        "standing_punch",
        "standing_kick",
        "standing_block",
        "standing_hit",
        "upper_cut",
        "spinkick",
        "spinkick_blocked",
        "leg_sweep",
        "ducking",
        "ducking_kick",
        "ducking_block",
        "ducking_hit",
        "jumping_up",
        "jumping_around",
        "jumping_punch",
        "jumping_kick",
        "falling_back",
        "falling_sweep",
        "hopping_up",
        "special",
        "dizzy",
        "victory",
    ];
    this.xPos = 100;
    this.yPos = 100;
    if (fighterConfig.imgs === undefined) {
      console.log("ERROR: Fighter config is missing imgs.");
      return;
    }
    for (let modeIdx in this.modes) {
      let mode = this.modes[modeIdx];
      if (fighterConfig.imgs[mode] === undefined) {
        console.log("WARN: Fighter config missing animation for mode: ", mode);
      }
      else {
        this.animations[mode] =
            loadAnimationFromConfig(fighterConfig.imgs[mode]);
      }
    }

    // Default animation
    this.curr_animation = 0;
    this.animation = this.animations["walk_forward"];
  }

  update() {
    this.animation.update();
  }

  draw() {
    this.animation.draw(this.xPos, this.yPos);
  }

  setAnimation(mode) {
    if (this.animations[mode] != undefined) {
      this.animation = this.animations[mode];
    }
  }

  nextAnimation() {
    this.animation.reset();
    this.curr_animation++;
    this.animation =
        this.animations[this.modes[this.curr_animation % this.modes.length]];
  }
};
