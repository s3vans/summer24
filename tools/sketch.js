
let img1;
let img2;
let img3;
let img4;
let img5;
let img6;
let img7;
let img8;
let img9;
let r_slider;
let g_slider;
let b_slider;
let counter = 0;

const imgs = [];

function preload() {
  img1 = loadImage('frame0001.png');
  img2 = loadImage('frame0002.png');
  img3 = loadImage('frame0003.png');
  img4 = loadImage('frame0004.png');
  img5 = loadImage('frame0005.png');
  img6 = loadImage('frame0006.png');
  img7 = loadImage('frame0007.png');
  img8 = loadImage('frame0008.png');
  img9 = loadImage('frame0009.png');
  imgs.push(img1);
  imgs.push(img2);
  imgs.push(img3);
  imgs.push(img4);
  imgs.push(img5);
  imgs.push(img6);
  imgs.push(img7);
  imgs.push(img8);
  imgs.push(img9);
}

function setup() {
  g_slider = createSlider(0, 255, 156);

  r_slider = createSlider(0, 255, 150);
  b_slider = createSlider(0, 255, 255);

  img1.loadPixels();
  img2.loadPixels();
  img3.loadPixels();
  img4.loadPixels();
  img5.loadPixels();
  img6.loadPixels();
  img7.loadPixels();
  img8.loadPixels();
  img9.loadPixels();

  //createCanvas(1080, 1920);
  //createCanvas(370, 650);
  createCanvas(720, 1280);
  frameRate(10);

  let width = img1.width;
  let height = img1.height;
  for (const im in imgs) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let pixelIndex = ((j*width + i) * 4);
        let r = imgs[im].pixels[pixelIndex+0];
        let g = imgs[im].pixels[pixelIndex+1];
        let b = imgs[im].pixels[pixelIndex+2];
        let avg = (r+b)/2;
        if (g > g_slider.value() && r < r_slider.value() && b < b_slider.value()) {
          imgs[im].pixels[pixelIndex+3] = 0;
        }
	else if (g > 2*avg) {
          imgs[im].pixels[pixelIndex+3] = 0;
        }
        else {
          imgs[im].pixels[pixelIndex+3] = 255;
        }
      }
    }
  }
  img1.updatePixels();
  img2.updatePixels();
  img3.updatePixels();
  img4.updatePixels();
  img5.updatePixels();
  img6.updatePixels();
  img7.updatePixels();
  img8.updatePixels();
  img9.updatePixels();
}

function draw() {
  clear();
  background(20,0,0);
  
  // Draw the image.
  //image(img, 0, 0, 1080, 1920, 480, 640);
  //image(img, 0, 0, 360, 640);

  console.log("Drawing " + counter % 9);
  image(imgs[counter % 9], 0, 0, 720*3/4, 1280*3*.6923/4, 150, 525, 820, 810);
  counter++;
}
