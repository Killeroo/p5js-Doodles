// Slow wallpaper

let slider;

function setup() {
  createCanvas(400, 400);

  slider = createSlider(0.1, 4, 1.6, 0.1);
  slider.position(10, 10);
  slider.size(200);
}

function draw() {
  background(220);
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  

  var time = millis() / 1000;
  var count = 200;//2000;
  var speed = 0.5;//slider.value(); 
  var zoom = 20; // less = zoom out (used to be 40)
  var widthHalf = width/2;
  var heightHalf = height/2;
  for (let i = 1; i < count; i++) {
    var rand = sin(i * i);
    var radius = time * speed / i + rand;
    var x = i * (Math.sin(radius)) * zoom;
    var y = slider.value()*(Math.cos(time * speed) / i + rand) * zoom * 10; // 1.6

    var c = lerp(0, 255, i / count);
    fill(c+ 60, c + 40, 30);
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}

// V2

let slider;

function setup() {
  createCanvas(400, 400);

  slider = createSlider(0.1, 4, 1.6, 0.1);
  slider.position(10, 10);
  slider.size(200);
}

function draw() {
  background(220);
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  

  var time = millis() / 1000;
  var count = 200;//2000;
  var speed = 1;//slider.value(); 
  var zoom = 40; // less = zoom out (used to be 40)
  var widthHalf = width/2;
  var heightHalf = height/2;
  for (let i = 1; i < count; i++) {
    var rand = sin(i * i);
    var radius = time * speed / i + rand;
    var x = i * (Math.sin(radius)) * zoom;
    var y = 0.2*(Math.cos(time * speed) / i + rand) * zoom * 10; // 1.6

    x = x / 4;
    y = y / slider.value();
    var c = lerp(0, 255, i / count);
    fill(c+ 60, c + 40, 30);
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}

// v3

let slider;

function setup() {
  createCanvas(400, 400);

  slider = createSlider(0.01, 4, 0.2, 0.01);
  slider.position(10, 10);
  slider.size(200);
}

function draw() {
  background(0, 10);
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  

  var time = millis() / 1000;
  var count = 200;//2000;
  var speed = 1;//slider.value(); 
  var zoom = 40; // less = zoom out (used to be 40)
  var widthHalf = width/2;
  var heightHalf = height/2;
  var xAmp = 4; // 1
  
  for (let i = 1; i < count; i++) {
    var rand = sin(i * i);
    var radius = time * speed / i + rand;
    var x = i * xAmp * (Math.sin(radius)) * zoom;
    var y = 0.02*(Math.cos(sin(radius) * (i * count) * 0.03) / i + rand + 0.5) * zoom * 25; // 1.6

    x = x / 4;
    y = y / 0.8;
    var c = lerp(0, 255, i / count);
    fill(c * 50, c * 2, (i / count) * 20);
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}