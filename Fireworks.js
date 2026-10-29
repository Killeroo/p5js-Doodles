/**
    Fireworks 2!
    
    This is based on an old sketch I made in Processing 3 (https://openprocessing.org/sketch/778707). Every X seconds
    a little physically based firework will be fired and explode.
    
    It's not as polished as some of my previous sketches, so don't judge too hard. But it's something I will continue to tweak. 
    A fun excuse to make a small particle system.
    
    Matthew Carney 
    me@matthewcarney.net 
    
    Changelog:
    Jan 2026 - First iteration
    Apr 2026 - Added trails, nicer explosion distribution and added more languages
*/

const CANVAS_HEIGHT = 250; 
const LAUNCH_FIREWORKS_ON_SIDE = false;

const DEFAULT_LIFESPAN = 400;
const GRAVITY = 400;
const TIMESCALE = 15;
const TEXT_ENTRIES = [
  // English
  "Hi!",
  "What's up?",
  // Korean
  "안녕하세요!",
  "좀 어때?",
  // French
  "Salut!",
  "ça va?",
  // Italian
  "Ciao!",
  "Come va?",
  // Greek
  "Γειά!",
  "Τι κάνεις;",
  // Spanish
  "Hola",
  "Qué tal",
  // German 
  "Hallöchen",
  "Wie geht's?",
  // Albanian
  "Çkemi?",
  "Si ke qëne?",
  // Thai
  "สวัสดี!",
  "สบายดีไหม",
  // Punjabi
  "Sat sri akal",
  "Ki haal chal?",
  // Dutch
  "Hoi!",
  "Alles goed?"
];

const AUTOFIRE_INTERVAL_MS = 1500;
const ZEROGRAVITY_PARTICLE_LIFESPAN = 100;

const SINGLE_COLOUR_PALLETE = [
  [217,102,41],
  [202,146,168],
  [135,197,64],
  [0,180,155],
  [181,177,216],
  [140,76,98],
  [0,147,165],
  [150,209,170],
  [118,44,25],
  [82,46,145]
];
const DOUBLE_COLOUR_PALETTES = [
  [[255,239,174], [175,212,114]],
  [[178,183,62], [248,182,186]],
  [[216,163,123], [171,36,57]],
  [[197,97,39], [178,183,62]],
  [[255,239,174], [221,64,39]],
  [[28,66,134], [255,242,0]],
  [[154,114,170], [253,197,126]],
  [[128,113,158], [100,45,94]],
  [[167,212,228], [193,159,44]],
  [[204,18,54], [0,91,141]]
];
const TRIPLE_COLOUR_PALETTES = [
  [[244,128,103], [181,222,204], [150,209,170]],
  [[191,88,146], [253,191,104], [0, 0, 255]],
  [[217,102,41], [0,147,155], [187,113,37]],
  [[166,44,55], [79,64,134], [187,113,37]],
  [[9,145,151], [193,159,44], [0,113,144]]
];

let parentElement;
let particles = [];
let lastFireMs = 0;
let useWholeWindow = false;

let starterMaxLength = 10;
let starterMaxWidth = 1;

function setup() {
  useWholeWindow = true;
  createCanvas(1000, 1000);
}

function draw() {
  background(0);

  if (!focus) {
    resetSketch();
    return;
  }

  // Particle system update loop
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    
    particle.update();
    particle.display();
    
    if (particle.vel.y > 0 && particle.canExplode() && particle.exploded == false) {
      particle.exploded = true;
      spawnExplosion(particle.pos);
    }      
  }
  
  // Remove dead particles
  particles = particles.filter(part => !part.canRemove());
  
  if (millis() > lastFireMs + AUTOFIRE_INTERVAL_MS || lastFireMs == 0) {
    // Fire a firework automagically every X milliseconds
    let quarterWidth = width * 0.25;
    let originX = random(0 + quarterWidth, width - quarterWidth);
    if (LAUNCH_FIREWORKS_ON_SIDE) {
      let halfWidth = (width * 0.5) - (quarterWidth *0.5);
      originX = randomRanges(50, halfWidth, width - halfWidth, width - 50);
    }
    let target = createVector(originX + random(-50, 50), random(0, height/2));
    fireFirework(originX, target);
    lastFireMs = millis();
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }

  let target = createVector(mouseX, mouseY);
  fireFirework(mouseX - (20 * deltaTime % 3 == 0 ? 1 : 2), target);
}

function windowResized() {
  if (useWholeWindow) {
    resizeCanvas(windowWidth, windowHeight);
  }
}

function resetSketch() {
  background(0);
  particles = [];
  lastFireMs = 0;
}

function randomRanges(min1, max1, min2, max2) {
  return random() < 0.5 ? random(min1, max1) : random(min2, max2);
}

function spawnExplosion(spawnLoc) {
  
  // TODO: We can probably do something better here to keep this DRY-ier but hey
  const spawnTrailingParticle = (pos, dir, colour) => {
    let trailingParticle = new TrailingParticle(pos);
    trailingParticle.colour = colour;
    trailingParticle.vel = dir.copy();
    trailingParticle.vel.mult(random(2, 5));
    particles.push(trailingParticle);
  }
  
  const spawnRandomMovementParticle = (pos, colour) => {
    let randomParticle = new RandomMovementParticle(pos);  
    randomParticle.colour = colour;
    particles.push(randomParticle);
  }
  
  const spawnFloatingParticle = (pos, dir, colour) => {
    let floatingParticle = new FloatingParticle(pos);
    floatingParticle.vel = dir.copy();
    floatingParticle.vel.mult(random(2, 5));
    floatingParticle.colour = colour;
    particles.push(floatingParticle);
  }
  
  const spawnDelayedParticle = (pos, dir, colour) => {
    let delayedParticles = new DelayedFallingParticles(pos);
    delayedParticles.vel = dir.copy();
    delayedParticles.vel.mult(random(2, 5));
    delayedParticles.colour = colour;
    particles.push(delayedParticles);
  }

  const pickColorSet = (count) => {
    switch (count) {
      case 3: return TRIPLE_COLOUR_PALETTES; 
      case 2: return DOUBLE_COLOUR_PALETTES; 
      default:
      case 1: return SINGLE_COLOUR_PALLETE; 
    }
  } 
  
  // TODO: A bit too much random here, would like to optimize this at some point
  let repetitions = floor(random(2, 4));

  // Pick a random colour pallette set
  let cs = pickColorSet(repetitions);
  let colorSet = cs[floor(random(pickColorSet(repetitions).length))];
  
  for (let rep = 0; rep < repetitions; rep++) {
    let c = repetitions == 1 ? color(colorSet[0], colorSet[1], colorSet[2]) : color(colorSet[rep][0], colorSet[rep][1], colorSet[rep][2]);
    let type = floor(random(4));
    let count = random(10, 30);
    for (let i = 0; i <= count; i++) {
      
      let angle = TWO_PI * (i / count);
      let x = cos(angle);
      let y = sin(angle);
      let dir = createVector(x, y);
      
      switch (type) {
        case 0: spawnTrailingParticle(spawnLoc, dir, c); break;
        case 1: spawnDelayedParticle(spawnLoc, dir, c); break;
        case 2: spawnFloatingParticle(spawnLoc, dir, c); break;
        case 3: spawnRandomMovementParticle(spawnLoc, c); break;
      }
    }
  }

  let txtParticle = new TextParticle(spawnLoc);
  txtParticle.vel = createVector(0, -1);
  txtParticle.vel.mult(3);
  particles.push(txtParticle);
}

function fireFirework(originX, target) {
  let base = createVector(originX, height);
  target.sub(base);
  target.normalize();
  
  let launchForce = createVector(target.x, target.y);
  let multiplier = 30000;
  if (useWholeWindow) {
    multiplier *= 2;
  }
  launchForce.mult(multiplier);
  part = new StarterParticle(createVector(originX, height));
  part.addForce(launchForce);
  particles.push(part);
}

class Particle {
  constructor(spawnPos) {
    this.pos = spawnPos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = random(600, 900);
    this.colour = color(255, 255, 255);
    this.remainingTicks = DEFAULT_LIFESPAN;
    this.exploded = false;
  }
  
  update() {
    const dt = (deltaTime / 1000) * TIMESCALE;
    
    // TODO: Don't create a new vector every frame
    this.addForce(createVector(0, this.getGravity()));
    
    this.vel.add(p5.Vector.mult(this.acc, dt));
    this.pos.add(p5.Vector.mult(this.vel, dt));
    this.acc.mult(0);
    
    this.remainingTicks--;
  }
  
  addForce(force) {
    let result = p5.Vector.div(force, this.mass);
    this.acc.add(result);
  }
  
  canExplode() {
    return true;
  }
  
  getGravity() {
    return GRAVITY;
  }
  
  display() {
    stroke(this.colour);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }
  
  canRemove() {
    if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
      // Out of bounds
      return true;
    }
    
    if (this.exploded == true) {
      // Remove any exploded particle by default
      return true; 
    }
    
    if (this.remainingTicks < 0) {
      // Out of time :(
      return true;
    }
    
    return false;
  }
}

class StarterParticle extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    
    this.ticksSinceLastSpawn = 3;
  }
  
  update() {
    super.update();
    
    // Spawn a lingering particle every X ticks
    this.ticksSinceLastSpawn--;
    if (this.ticksSinceLastSpawn < 0) {
      
      let offset = random(-2,2);
      let spawnPos = this.pos.copy();
      spawnPos.x += offset;
      spawnPos.y += offset;
      let lingerer = new LingeringParticle(spawnPos);
      particles.push(lingerer);
      this.ticksSinceLastSpawn = random(3, 6);
    }
  }
  
  display() {
    let dir = this.vel.heading();
    let baseSize = 1;
    let size = map(this.vel.magSq(), 0, 50, baseSize, baseSize * starterMaxLength);
    
    stroke(this.colour);
    strokeWeight(2);
    
    push();
      translate(this.pos.x, this.pos.y); // Move origin to center
      rotate(dir);
      ellipse(0, 0, size, starterMaxWidth);
    pop();
  }
}


class LingeringParticle extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    this.remainingTicks = 50;
  }
  
  getGravity() {
    return 100;
  }
  
  canExplode() {
    return false;
  }
  
  display() {
    this.colour.setAlpha(map(this.remainingTicks, 0, 50, 0, 255));
    super.display();
  }
}

class FloatingParticle extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    this.remainingTicks = ZEROGRAVITY_PARTICLE_LIFESPAN;
  }
  
  getGravity() {
    return 0;
  }
  
  canExplode() {
    return false;
  }
  
  display() {
    this.colour.setAlpha(map(this.remainingTicks, 0, ZEROGRAVITY_PARTICLE_LIFESPAN, 0, 255));
    super.display();
  }
}

class DelayedFallingParticles extends FloatingParticle {
  getGravity() {
    if (this.remainingTicks < 75) {
      return GRAVITY;
    } else {
      return 0;  
    }
  }
  
  canExplode() {
    return false;
  }
}

class TrailingParticle extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    
    this.remainingTicks = 150;
    this.prevLocations = []
    this.tickDelay = 0;
  }
  
  canExplode() {
    return false;
  }
  
  getGravity() {
    return GRAVITY / 3;
  }
  
  update() {
    super.update();
    
    this.prevLocations.push(this.pos.copy());
    
    if (this.prevLocations.length > 5) {
      this.prevLocations.shift();
    }
  }
  
  display() {
    let baseAlpha = map(this.remainingTicks, 0, 200, 0, 255);
    
    let prevLoc;
    for (let loc of this.prevLocations) {
      if (prevLoc != null) {
        this.colour.setAlpha(Math.min(baseAlpha, map(p5.Vector.sub(prevLoc, this.pos).magSq(), 50, 0, 0, 255)));
        stroke(this.colour);
        line(prevLoc.x, prevLoc.y, loc.x, loc.y);
      }
      prevLoc = loc;
    }
    
    // Always join up with the current particle location
    line(prevLoc.x, prevLoc.y, this.pos.x, this.pos.y);
    
    super.display();
  }
}

class TextParticle extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    
    this.text = random(TEXT_ENTRIES);
    this.angle = 0;
    this.rotSpeed = random(-0.05, 0.05);
  }
  
  getGravity() {
    return GRAVITY / 3;
  }
  
  canExplode() {
    return false;
  }
  
  update() {
    super.update();
    
    this.angle += this.rotSpeed;
  }
  
  display() {
    textAlign(CENTER, CENTER);
    push();
      noStroke();
      translate(this.pos.x, this.pos.y);
      rotate(this.angle);
      fill(this.colour);
      text(this.text, 0, 0);
    pop();
  }
}

class RandomMovementParticle extends TrailingParticle {
  constructor(spawnPos) {
    super(spawnPos);
    
    this.forceMult = random(200, 1000);
    this.remainingTicks = 100;
  }
  
  update() {
    this.addForce(p5.Vector.random2D().mult(this.forceMult));
    super.update();
  }
  
  getGravity() {
    return 0;
  }
  
  canExplode() {
    return false;
  }
}