
let r_slider;
let g_slider;
let b_slider;
let counter = 0;

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

  //createCanvas(1080, 1920);
  //createCanvas(370, 650);
  createCanvas(720, 1280);
  frameRate(10);

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
  clear();
  background(60,0,0);
  
  // Draw the image.
  //image(img, 0, 0, 1080, 1920, 480, 640);
  //image(img, 0, 0, 360, 640);

  //console.log("Drawing " + counter % 9);
  image(imgs[counter % 9], 0, 0, 720*3/4, 1280*3*.6923/4, 150, 525, 820, 810);
  counter++;
}
