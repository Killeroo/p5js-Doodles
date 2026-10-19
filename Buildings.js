let camera;

function setup() {
  createCanvas(400, 400, WEBGL);
  camera = createCamera();

  camera.setPosition(0, 0, 200);
}

var pos = 5;
function draw() {
  background(0);
  var time = (millis() / 1000);

  
  // Enable orbiting with the mouse.
  // orbitControl();

  camera.move(0, 0, pos);

  pos++;
  print(pos);
  
  // box(30, 50, 10);
  
  var vect = createVector(10, 1, 10);
  // push();
  //   translate(vect);
  //   box(30, 50, 10);
  // pop();
  print(sin(time));
  // print(vect);
  drawRect(vect, 30, 50, 10);
  vect.z += 30;
  drawRect(vect, 30, 50, 10);
  vect.z += 30;
  drawRect(vect, 30, 50, 10);
  vect.z += 30;
  drawRect(vect, 30, 50, 10);
  vect.z += 30;
  drawRect(vect, 30, 50, 10);
}

function drawRect(pos, w, h, d)
{
  push();
    translate(pos);
    box(w, h, d);
  pop();
}