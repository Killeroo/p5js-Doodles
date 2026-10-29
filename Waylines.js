// Waylines.js 
// Matthew Carney (matthewcarney.net), Aug 2026

let count = 250;
let speed = 2;
let zoom = 20;
let xAmp = 7;
let heightOffset = 200;

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(0, 20);
	translate(0, height/2);
	noStroke()
	
	var time = (millis() / 1000);
	for (let i = 1; i < count; i++) {
		var rand = sin(i * i);
		var radius = time * speed / i;// + rand;
		var x = i * xAmp * (Math.sin(radius * 0.5)) * zoom;
        var breath = 10;// sin(time * 0.5) * 10;
		var y = 0.02*(Math.cos(sin(radius) * (i * count) * 0.01) / 0.3) * zoom * breath; 
		x = x / 4;
		y = y / 0.8;
		x = x % width;
		var c = lerp(0, 255, i / count);
		fill(c, 100, 120);//, c * 2, (i / count) * 20);
      // print(abs(sin(i) * 255));
		ellipse(x, y + heightOffset, 5, 5);
	}
}