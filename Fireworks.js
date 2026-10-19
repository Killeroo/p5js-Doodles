
let fireworkSketch = function(p) {
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

  var canvas;

  // Handle when user tabs back into page
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
      resetSketch();
    }
  });

  p.setup = function() {
    useWholeWindow = window.globalSketchSettings?.useWholeWindow ?? false;

    if (useWholeWindow) {
      p.createCanvas(p.windowWidth, p.windowHeight);

      starterMaxLength = 5;
      starterMaxWidth = 2;
    } else {
      parentElement = p.select("#sketch-canvas");
      
      canvas = p.createCanvas(parentElement.width, CANVAS_HEIGHT);
      canvas.parent("#sketch-canvas");
    }
  }

  p.draw = function() {
    p.background(0);

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
    
    if (p.millis() > lastFireMs + AUTOFIRE_INTERVAL_MS || lastFireMs == 0) {
      // Fire a firework automagically every X milliseconds
      let quarterWidth = p.width * 0.25;
      let originX = p.random(0 + quarterWidth, p.width - quarterWidth);
      if (LAUNCH_FIREWORKS_ON_SIDE) {
        let halfWidth = (p.width * 0.5) - (quarterWidth *0.5);
        originX = randomRanges(50, halfWidth, p.width - halfWidth, p.width - 50);
      }
      let target = p.createVector(originX + p.random(-50, 50), p.random(0, p.height/2));
      fireFirework(originX, target);
      lastFireMs = p.millis();
    }
  }

  p.mousePressed = function() {
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
      return;
    }

    let target = p.createVector(p.mouseX, p.mouseY);
    fireFirework(p.mouseX - (20 * p.deltaTime % 3 == 0 ? 1 : 2), target);
  }

  p.windowResized = function() {
    if (useWholeWindow) {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
  }

  function resetSketch() {
    p.background(0);
    particles = [];
    lastFireMs = 0;
  }

  function randomRanges(min1, max1, min2, max2) {
    return p.random() < 0.5 ? p.random(min1, max1) : p.random(min2, max2);
  }

  function spawnExplosion(spawnLoc) {
    
    // TODO: We can probably do something better here to keep this DRY-ier but hey
    const spawnTrailingParticle = (pos, dir, colour) => {
      let trailingParticle = new TrailingParticle(pos);
      trailingParticle.colour = colour;
      trailingParticle.vel = dir.copy();
      trailingParticle.vel.mult(p.random(2, 5));
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
      floatingParticle.vel.mult(p.random(2, 5));
      floatingParticle.colour = colour;
      particles.push(floatingParticle);
    }
    
    const spawnDelayedParticle = (pos, dir, colour) => {
      let delayedParticles = new DelayedFallingParticles(pos);
      delayedParticles.vel = dir.copy();
      delayedParticles.vel.mult(p.random(2, 5));
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
    let repetitions = p.floor(p.random(2, 4));

    // Pick a random colour pallette set
    let cs = pickColorSet(repetitions);
    let colorSet = cs[p.floor(p.random(pickColorSet(repetitions).length))];
    
    for (let rep = 0; rep < repetitions; rep++) {
      let c = repetitions == 1 ? p.color(colorSet[0], colorSet[1], colorSet[2]) : p.color(colorSet[rep][0], colorSet[rep][1], colorSet[rep][2]);
      let type = p.floor(p.random(4));
      let count = p.random(10, 30);
      for (let i = 0; i <= count; i++) {
        
        let angle = p.TWO_PI * (i / count);
        let x = p.cos(angle);
        let y = p.sin(angle);
        let dir = p.createVector(x, y);
        
        switch (type) {
          case 0: spawnTrailingParticle(spawnLoc, dir, c); break;
          case 1: spawnDelayedParticle(spawnLoc, dir, c); break;
          case 2: spawnFloatingParticle(spawnLoc, dir, c); break;
          case 3: spawnRandomMovementParticle(spawnLoc, c); break;
        }
      }
    }

    let txtParticle = new TextParticle(spawnLoc);
    txtParticle.vel = p.createVector(0, -1);
    txtParticle.vel.mult(3);
    particles.push(txtParticle);
  }

  function fireFirework(originX, target) {
    let base = p.createVector(originX, p.height);
    target.sub(base);
    target.normalize();
    
    let launchForce = p.createVector(target.x, target.y);
    let multiplier = 30000;
    if (useWholeWindow) {
      multiplier *= 2;
    }
    launchForce.mult(multiplier);
    part = new StarterParticle(p.createVector(originX, p.height));
    part.addForce(launchForce);
    particles.push(part);
  }

  class Particle {
    constructor(spawnPos) {
      this.pos = spawnPos.copy();
      this.vel = p.createVector();
      this.acc = p.createVector();
      this.mass = p.random(600, 900);
      this.colour = p.color(255, 255, 255);
      this.remainingTicks = DEFAULT_LIFESPAN;
      this.exploded = false;
    }
    
    update() {
      const dt = (p.deltaTime / 1000) * TIMESCALE;
      
      // TODO: Don't create a new vector every frame
      this.addForce(p.createVector(0, this.getGravity()));
      
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
      p.stroke(this.colour);
      p.strokeWeight(2);
      p.point(this.pos.x, this.pos.y);
    }
    
    canRemove() {
      if (this.pos.x > p.width || this.pos.x < 0 || this.pos.y > p.height || this.pos.y < 0) {
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
        
        let offset = p.random(-2,2);
        let spawnPos = this.pos.copy();
        spawnPos.x += offset;
        spawnPos.y += offset;
        let lingerer = new LingeringParticle(spawnPos);
        particles.push(lingerer);
        this.ticksSinceLastSpawn = p.random(3, 6);
      }
    }
    
    display() {
      let dir = this.vel.heading();
      let baseSize = 1;
      let size = p.map(this.vel.magSq(), 0, 50, baseSize, baseSize * starterMaxLength);
      
      p.stroke(this.colour);
      p.strokeWeight(2);
      
      p.push();
        p.translate(this.pos.x, this.pos.y); // Move origin to center
        p.rotate(dir);
        p.ellipse(0, 0, size, starterMaxWidth);
      p.pop();
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
      this.colour.setAlpha(p.map(this.remainingTicks, 0, 50, 0, 255));
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
      this.colour.setAlpha(p.map(this.remainingTicks, 0, ZEROGRAVITY_PARTICLE_LIFESPAN, 0, 255));
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
      let baseAlpha = p.map(this.remainingTicks, 0, 200, 0, 255);
      
      let prevLoc;
      for (let loc of this.prevLocations) {
        if (prevLoc != null) {
          this.colour.setAlpha(Math.min(baseAlpha, p.map(p5.Vector.sub(prevLoc, this.pos).magSq(), 50, 0, 0, 255)));
          p.stroke(this.colour);
          p.line(prevLoc.x, prevLoc.y, loc.x, loc.y);
        }
        prevLoc = loc;
      }
      
      // Always join up with the current particle location
      p.line(prevLoc.x, prevLoc.y, this.pos.x, this.pos.y);
      
      super.display();
    }
  }

  class TextParticle extends Particle {
    constructor(spawnPos) {
      super(spawnPos);
      
      this.text = p.random(TEXT_ENTRIES);
      this.angle = 0;
      this.rotSpeed = p.random(-0.05, 0.05);
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
      p.textAlign(p.CENTER, p.CENTER);
      p.push();
        p.noStroke();
        p.translate(this.pos.x, this.pos.y);
        p.rotate(this.angle);
        p.fill(this.colour);
        p.text(this.text, 0, 0);
      p.pop();
    }
  }

  class RandomMovementParticle extends TrailingParticle {
    constructor(spawnPos) {
      super(spawnPos);
      
      this.forceMult = p.random(200, 1000);
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
};

new p5(fireworkSketch);