// Spiral 

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
  var count = 500; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;

  for (let i = 1; i < count; i++) {
    var index_red = i / 10;
    var x = Math.sin((index_red * time) * slider.value()) * (1 * i);
    var y = Math.cos((index_red * time) * slider.value()) * (1 * i);

    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}

// v2 - galaxy

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
    var y = Math.cos((index_red * time) * slider.value()) * (1 * i);

    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}

// v3 - slow galaxy


let slider;

function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.01, 1, 0.01, 0.01);
  slider.position(10, 10);
  slider.size(200);
}

function draw() {
  background(0, 20);
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  

  var time = (millis() / 1000) + 220;
  var count = 200; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;

  for (let i = 1; i < count; i++) {
    var index_red = i / 10;
    var x = Math.sin((index_red * time) * slider.value()) * (2 * i);
    var y = Math.cos((index_red * time) * slider.value()) * (1 * i);

    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}

// V4 - Tube


let slider;

function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 2, 0.25, 0.01);
  slider.position(10, 10);
  slider.size(200);
}

function draw() {
  background(0, 40);
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  

  var time = ((millis() / 1000) + 50);
  var count = 500; //200 //2000;
  var widthHalf = width/2;
  var heightHalf = height/2;

  // print(time)

  for (let i = 1; i < count; i++) {
    var index_pos = i / count;
    var speed_mult = pow(index_pos, 0.25);//slider.value());
    var rand = sin(i*i) * (i/4) ;
    
    var x = Math.sin((speed_mult * time) * 1.25) * (2 * i) + (rand*10);
    var y = Math.cos((speed_mult * time) * 1.25) * (1 * i) + (rand*30);
    x = x * 0.2;
    y = (y * 0.2);// * (rand * 0.2);

    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}


