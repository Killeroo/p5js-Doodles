// Tornado

// droplet

let slider;

function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 400, 180, 0.1);
  slider.position(10, 10);
  slider.size(200);
}

function draw() {
  background(0, 20);
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  

  var time = (millis() / 1000) + 2;
  var count = 500; //200 //2000;
  var speed = 14;//slider.value(); 
  var zoom = 2; // less = zoom out (used to be 40) // 10 // 1
  var widthHalf = width/2;
  var heightHalf = height/2;
  var sizeY = 1.6;

  // print(sin((time % 0.1) * 2) * 100);
  var variance = (sin(((2 * PI) * time) / 4.5)+ 1)* 45;
  for (let i = 1; i < count; i++) {
    var rand = sin(i * i);
    var radius = time * speed / i + rand;
    var x = i * (Math.sin((radius * i)*0.05)/3) * zoom;
    x = x * 1; // Size (remove 0.1)
    var y = sizeY*(Math.cos(time * speed / 30) / ((i*0.025) * rand)) * zoom * slider.value(); // 1.6
    y = y /2; 
    var c = lerp(0, 255, i / count) + variance;
    // fill(c+ 30, c + 50, c - 70);
    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}

// 2 - slightly less tall

// // droplet

// let slider;

// function setup() {
//   createCanvas(1000, 1000);

//   slider = createSlider(0.1, 400, 180, 0.1);
//   slider.position(10, 10);
//   slider.size(200);
// }

// function draw() {
//   background(0, 20);
//   fill(0);
//   text(slider.value(), 220, 27);
//   noStroke();
  

//   var time = (millis() / 1000);
//   var count = 500; //200 //2000;
//   var widthHalf = width/2;
//   var heightHalf = height/2;

//   // print(sin((time % 0.1) * 2) * 100);
//   var variance = (sin(((2 * PI) * time) / 4.5)+ 1)* 45;
//   for (let i = 1; i < count; i++) {
//     var rand = sin(i * i);
//     var radius = time * speed / i + rand;
//     var x = i * Math.sin((radius * i));
//     var y = (Math.cos(time * speed / 30) / ((i*0.025) * rand)) * zoom * slider.value(); // 1.6
//     y = y /2; 

//     fill(lerp(0, 255, i / count), 255, 255)
//     ellipse(widthHalf + x, heightHalf + y, 2, 2);
//   }

// }

// Tornado

// droplet

let slider;

function setup() {
  createCanvas(1000, 1000);

  slider = createSlider(0.1, 400, 180, 0.1);
  slider.position(10, 10);
  slider.size(200);
}

function draw() {
  background(0, 20);
  fill(0);
  text(slider.value(), 220, 27);
  noStroke();
  

  var time = (millis() / 1000) + 2;
  var count = 500; //200 //2000;
  var speed = 14;//slider.value(); 
  var zoom = 2; // less = zoom out (used to be 40) // 10 // 1
  var widthHalf = width/2;
  var heightHalf = height/2;
  var sizeY = 0.6;

  // print(sin((time % 0.1) * 2) * 100);
  var variance = (sin(((2 * PI) * time) / 4.5)+ 1)* 45;
  for (let i = 1; i < count; i++) {
    var rand = sin(i * i);
    var radius = time * speed / i + rand;
    var x = i * (Math.sin((radius * i)*0.05)/3) * zoom;
    x = x * 1; // Size (remove 0.1)
    var y = sizeY*(Math.cos(time * speed / 30) / ((i*0.025) * rand)) * zoom * slider.value(); // 1.6
    y = y /2; 
    var c = lerp(0, 255, i / count) + variance;
    // fill(c+ 30, c + 50, c - 70);
    fill(lerp(0, 255, i / count), 255, 255)
    ellipse(widthHalf + x, heightHalf + y, 2, 2);
  }

}