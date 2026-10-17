Tentacle

let slider;

function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 1, 0.25, 0.01);
  slider.position(10, 10);
  slider.size(200);

}

function draw() {
  background(0, 40); //20
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  
  var time = (millis() / 1000) + 25;
  time = sin(time) * 10;
  var count = 200; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;
  var seed = 0.9;

  for (let i = 1; i < count; i++) {
    var index_norm = i / count;
    var index_red = i * 0.0075;
    var rand = (sin(i * 52.12) * 32087) % 1; // Take a big number, get the last decimal place, it appears random 
    var x = Math.sin((index_red * time) * seed) * (2 * i) + (rand*25);
    var y = Math.sin((index_red * time) + (seed/i)) * (1 * i) + (rand*10);
    
    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, (index_norm*20) + 2, (index_norm*20) + 2);
  }

}

// V2 - Colours

let slider;

function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 1, 0.25, 0.01);
  slider.position(10, 10);
  slider.size(200);

  background(0);
}

function draw() {
   background(0, 40); //20
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  
  var time = (millis() / 1000) + 25;
  time = sin(time) * 10;
  var count = 200; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;
  var seed = 0.9;

  for (let i = 1; i < count; i++) {
    var index_norm = i / count;
    var index_red = i * 0.0075;
    var rand = (sin(i * 52.12) * 32087) % 1; // Take a big number, get the last decimal place, it appears random 
    var x = Math.sin((index_red * time) * seed) * (2 * i) + (rand*25);
    var y = Math.sin((index_red * time) + (seed/i)) * (1 * i) + (rand*10);
    
    fill(lerp(0, 255, i / count), (millis()*0.009)%255, millis()*0.9*255)
    ellipse(widthHalf + x, heightHalf + y, (rand*15) + 2, (rand*15) + 2);
  }

}

// V3 - Great

let slider;

function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 1, 0.25, 0.01);
  slider.position(10, 10);
  slider.size(200);

  background(0);

}
var seed = 0.9;

function draw() {
   background(0, 40); //20
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  
  var time = (millis() / 1000) + 25;
  time = sin(time/4) * 20;
  var count = 200; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;
  if (abs(time) < 0.1) {
    // I wanted to use as much maths as possible but I folded 
    seed = random(0, 1);
  }

  for (let i = 1; i < count; i++) {
    var index_norm = i / count;
    var index_red = i * 0.0075;
    var rand = (sin(i * 52.12) * 32087) % 1; // Take a big number, get the last decimal place, it appears random 
    var x = Math.sin((index_red * time) * seed) * (2 * i) + (rand*25);
    var y = Math.sin((index_red * time) + (seed/i)) * (1 * i) + (rand*10);

    fill(lerp(0, 255, i / count), (millis()*0.009)%255, millis()*0.009%255)
    ellipse(widthHalf + x, heightHalf + y, (rand*15) + 2, (rand*15) + 2);
  }

}