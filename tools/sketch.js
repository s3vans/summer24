
let r_slider;
let g_slider;
let b_slider;
let fps_slider;

let counter = 0;

const canvasWidth = 720;
const canvasHeight = 600;
const frameWidth = 1080;
const frameHeight = 1920;

const imgs = [];

function preload() {
  imgs.push(loadImage('frame0001.png'));
  imgs.push(loadImage('frame0002.png'));
  imgs.push(loadImage('frame0003.png'));
  imgs.push(loadImage('frame0004.png'));
  imgs.push(loadImage('frame0005.png'));
  imgs.push(loadImage('frame0006.png'));
  imgs.push(loadImage('frame0007.png'));
  imgs.push(loadImage('frame0008.png'));
  imgs.push(loadImage('frame0009.png'));
}

function setup() {
  g_slider = createSlider(0, 255, 156);
  r_slider = createSlider(0, 255, 150);
  b_slider = createSlider(0, 255, 255);
  fps_slider = createSlider(0, 60, 10);

  createCanvas(canvasWidth, canvasHeight);
  frameRate(fps_slider.value());

  for (let img of imgs) {
    img.loadPixels();
    let width = img.width;
    let height = img.height;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let pixelIndex = ((j*width + i) * 4);
        let r = img.pixels[pixelIndex+0];
        let g = img.pixels[pixelIndex+1];
        let b = img.pixels[pixelIndex+2];
        let avg = (r+b)/2;
        if (g > g_slider.value() && r < r_slider.value() && b < b_slider.value()) {
          img.pixels[pixelIndex+3] = 0;
        }
	else if (g > 2*avg) {
          img.pixels[pixelIndex+3] = 0;
        }
        else {
          img.pixels[pixelIndex+3] = 255;
        }
      }
    }
    img.updatePixels();
  }
}

function draw() {
  frameRate(fps_slider.value());
  background(60,0,0);

  const boundingBoxX = 150;
  const boundingBoxY = 525;
  const boundingBoxWidth = 820;
  const boundingBoxHeight = 810;
  const boundingBoxRatio = boundingBoxWidth / boundingBoxHeight;

  const dstTargetWidth = canvasWidth*1/4;
  const dstTargetHeight = dstTargetWidth / boundingBoxRatio;

  image(imgs[counter % 9],
        /*dstX=*/0, /*dstY=*/0,
        dstTargetWidth, dstTargetHeight,
        boundingBoxX, boundingBoxY,
        boundingBoxWidth, boundingBoxHeight);

  counter++;
}
