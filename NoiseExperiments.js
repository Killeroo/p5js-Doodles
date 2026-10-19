function setup() {
  createCanvas(400, 400);
}

let diameterX = 20;
let diameterY = 20;

function draw() {
  background(0);

  let time = (millis() / 1000) * 0.2;
  let noiseScale = 0.009;
  let t = sin(time) * 255;
  let countX = width / diameterX;
  let countY = height / diameterY;
  for (let x = 0; x < width; x += diameterX/2) {
    for (let y = 0; y < height; y += diameterY/2) {
      let n = noise(x * noiseScale + time, y * noiseScale);
      // fill(t, n *255, (n * 125) + 30);
      fill(n * 255);
      ellipse(x + 20, y + 20, n * diameterY, n * diameterY);
    }
  }
}

// function setup() {
//   createCanvas(100, 100);

//   describe('A gray cloudy pattern that changes.');
// }

// let time = 0;
// function draw() {
//   // Set the noise level and scale.
//   let noiseLevel = 255;
//   let noiseScale = 0.009;

//   time = millis() / 1000;
//   time *= 0.2
//   // Iterate from top to bottom.
//   for (let y = 0; y < 100; y += 1) {
//     // Iterate from left to right.
//     for (let x = 0; x < width; x += 1) {
//       // Scale the input coordinates.
//       let nx = noiseScale * x;
//       let ny = noiseScale * y;
//       let nt = noiseScale * frameCount;

//       // Compute the noise value.
//       let c = noiseLevel * noise(nx + time, ny + time);

//       // Draw the point.
//       stroke(c);
//       point(x, y);
//     }
//   }
// }