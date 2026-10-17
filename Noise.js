Noise

let slider;

function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 1, 0.25, 0.01);
  slider.position(10, 10);
  slider.size(200);
}

function draw() {
  background(0, 20);
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  

  var time = (millis() / 1000);
  var count = 200; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;

  for (let i = 1; i < count; i++) {
    var index_red = i / 10;
    var x = Math.sin((index_red * time) * slider.value()) * (2 * i);
    var y = Math.sin((index_red * time) + (slider.value()/i)) * (1 * i);
    
    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}

// V2 - slowed down

let slider;

function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 1, 0.25, 0.01);
  slider.position(10, 10);
  slider.size(200);
}

function draw() {
  background(0, 20);
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  

  var time = (millis() / 1000);
  var count = 200; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;

  for (let i = 1; i < count; i++) {
    var index_red = i * 0.01;
    var x = Math.sin((index_red * time) * slider.value()) * (2 * i) //+ (cos(i*i)*2);
    var y = Math.sin((index_red * time) + (slider.value()/i)) * (1 * i);
    
    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}

// V3 - Roller

let slider;

function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 1, 0.25, 0.01);
  slider.position(10, 10);
  slider.size(200);
}

function draw() {
  background(0, 20);
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  

  var time = (millis() / 1000);
  var count = 200; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;

  for (let i = 1; i < count; i++) {
    var index_red = i * 0.01;
    var x = Math.sin((index_red * time) * slider.value()) * (2 * i) * (cos(i*i)*2);
    var y = Math.sin((index_red * time) + (slider.value()/i)) * (1 * i);
    
    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}

// V4 - Unfolding

// The slider is really interesting, basically any value between 0 and 1 produces some cool stuff

let slider;

var seed;
function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 1, 0.25, 0.01);
  slider.position(10, 10);
  slider.size(200);

  seed = day()/30;
  print(day()/30)
}

function draw() {
  background(0, 40); //20
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  
  var time = (millis() / 1000);
  var count = 200; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;


  for (let i = 1; i < count; i++) {
    var index_norm = i / count;
    var index_red = i * 0.0075;
    var x = Math.sin((index_red * time) * slider.value()) * (2 * i) + (cos(i*i)*5);
    var y = Math.sin((index_red * time) + (slider.value()/i)) * (1 * i);
    
    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, (index_norm*20) + 2, (index_norm*20) + 2);
  }

}


// v5 - seeded 

let slider;

var seed;
function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 1, 0.25, 0.01);
  slider.position(10, 10);
  slider.size(200);

  seed = day()/30;
}

function draw() {
  background(0, 40); //20
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  
  var time = (millis() / 1000);
  var count = 200; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;


  for (let i = 1; i < count; i++) {
    var index_norm = i / count;
    var index_red = i * 0.0075;
    var x = Math.sin((index_red * time) * seed) * (2 * i) + (cos(i*i)*5);
    var y = Math.sin((index_red * time) + (seed/i)) * (1 * i);
    
    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, (index_norm*20) + 2, (index_norm*20) + 2);
  }

}

// v6 noisier 

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
  var count = 200; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;
  var seed = 0.25;

  for (let i = 1; i < count; i++) {
    var index_norm = i / count;
    var index_red = i * 0.0075;
    var rand = (sin(i * 52.12) * 32087) % 1;
    var x = Math.sin((index_red * time) * seed) * (2 * i) + (rand*25);
    var y = Math.sin((index_red * time) + (seed/i)) * (1 * i);
    
    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, (index_norm*20) + 2, (index_norm*20) + 2);
  }

}
