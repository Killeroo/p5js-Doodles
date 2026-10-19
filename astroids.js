  /**
      Astroid Assault!
      
      A small game entirely using p5js. Shoot astroids, get high scores, what more do you want?
      
      My first time writing a whole game in processing, so it's a bit rough around the edges. Generally
      I'm impressed with how performant js and p5js seems to be (thanks browsers!). Was a fun little project.
      
      Matthew Carney 
      me@matthewcarney.net 
      
      Changelog:
      May 2026 - Initial release
  */

var canvas;

const CANVAS_HEIGHT = 400; 
const FULL_WINDOW_WIDTH = 800;
const FULL_WINDOW_HEIGHT = 400;

const GAME_TIME = 60;

const DEFAULT_LIFESPAN = 400;
const GRAVITY = 400;
const TIMESCALE = 15;

const METEOR_SPAWN_RATE_MS = 1250;
const EXPLOSION_PARTICLE_LIFESPAN = 50;

const METEOR_MAX_MASS = 600;
const METEOR_MIN_MASS = 300;

const HIT_TEXT_ENTRIES = [
  "Nice one",
  "Great shot",
  "Nice",
  "Hooooly",
  "Gawd dam",
  "Put your weight on it",
  "Wammy",
  "Bingo",
  "Woo",
  "Wow",
  "Yas",
  "Nice",
  "Nioce",
  "Yup",
  "Target Down",
  "Sugoi",
  "Yarp",
  "Neat",
  "Hot dog",
  "Dam son"
];

const MISS_TEXT_ENTRIES = [
  "My gran is better",
  "Ooof",
  "Stay in school",
  "Boo!",
  "No",
  "Nope",
  "Narp",
  "It's a no from me Dawg",
  "Ouch",
  "Nah",
  "Really?"
];

let rankingSetup = [];
let scoreSetup = [];

let parentElement;
let gameState;
let ui;
let particleContainer;
let vfxContainer;

const COMBO_STRINGS = [
  "",
  "Combo",
  "Mega-Combo",
  "Ultra-Combo",
  "Omni-Combo",
  "Wombo-Combo",
  "Just Chill Dude.."
]

let useWholeWindow = false;

function setup() {
  useWholeWindow = window.globalSketchSettings?.useWholeWindow ?? false;
  parentElement = select("#sketch-canvas-astroid");
  
  // We have to initialize it here as we can't access color before p5js has initialized
  rankingSetup.push(
    {letter: 'D', threshold: 0, colour: color(255), text: "Hmm you ok?", bounce: 2, rotate: false},
    {letter: 'C', threshold: 500, colour: color(144,213,255), text: "Ok", bounce: 2, rotate: false},
    {letter: 'B', threshold: 1500, colour: color(136,231,136), text: "Good job", bounce: 3, rotate: false},
    {letter: 'A', threshold: 2500, colour: color(239,191,4), text: "Impressive", bounce: 5, rotate: true},
    {letter: 'S', threshold: 3000, colour: color('red'), text: "Dam son!", bounce: 10, rotate: true});

  // NOT USED, color structs are mutable so need to be copied for each particle when using this array for setup
  scoreSetup.push(
    {threshold: 70, points: 10, colour: color(255)},
    {threshold: 40, points: 20, colour: color(124,252,0)},
    {threshold: 10, points: 50, colour: color(144, 213, 255)},
    {threshold: 0, points: 100, colour: color('magenta')},
  )  

  if (useWholeWindow) {
    const sizeX = FULL_WINDOW_WIDTH > windowWidth ? windowWidth : FULL_WINDOW_WIDTH;
    const sizeY = FULL_WINDOW_HEIGHT > windowHeight ? windowHeight : FULL_WINDOW_HEIGHT;
    canvas = createCanvas(sizeX, sizeY);
  } else {
    canvas = createCanvas(parentElement.width, CANVAS_HEIGHT);
  }
  canvas.parent("#sketch-canvas-astroid");
  
  //createCanvas(800, 400);
  
  gameState = new Game();
  ui = new UI();
  particleContainer = new ParticlesContainer();
  vfxContainer = new EffectsContainer();
}

function draw() {
  background(0);

  vfxContainer.preUpdate();
  
  ui.draw(gameState);
  particleContainer.update();
  gameState.tick();
  
  vfxContainer.postUpdate();
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }
  
  if (gameState.demoMode) {
    gameState.demoMode = false;
    particleContainer.spawnTextParticle(
      "SHOOT THOSE ASTROIDS!", 
      createVector(width/2, height/2),
      5, 
      150, 
      color(255),
      createVector(0, -1),
      0,
      2
    );
  }

  gameState.onMousePress(mouseX, mouseY);
  ui.onMousePress();
}

function restartGame() {
  gameState.reset();
  ui.reset();
}

class ParticlesContainer {
  constructor() {
    this.meteors = [];
    this.particles = [];
  }
  
  update() {
    this.updateArray(this.meteors);
    this.updateArray(this.particles);
    
    this.meteors = this.meteors.filter(m => !m.canRemove());
    this.particles = this.particles.filter(p => !p.canRemove());
  }
  
  updateArray(particles) {
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];

      p.update();
      p.display();
    }
  }
  
  spawnMeteor(spawnPos) {
    let launchForce = createVector(random(0, 20000), 30000);
  
    if (spawnPos.x > width / 2) {
      launchForce.x = -launchForce.x;
    }
  
    let part = new Meteor(spawnPos);
    part.addForce(launchForce);
    this.meteors.push(part);
  }
  
  generateInAirExplosion(spawnPos, size, originalVel, colour, perpendicular) {    
    const setupParticle = (particle, dir, colour, force, mass) => {
      particle.vel = dir.copy();
      particle.vel.mult(force);
      particle.colour = colour;
      if (mass > 0) {
        particle.mass = mass; 
      }
      this.particles.push(particle);
      return particle;
    }
    
    let count = map(size, METEOR_MIN_MASS, METEOR_MAX_MASS, 5, 14);
    let iteration = 0;
    for (let i = 0; i < 4; i++) {
      iteration++;
      for (let i = 0; i <= count; i++) {
        let angle = TWO_PI * (i / count);
        let x = cos(angle);
        let y = sin(angle);
        let dir = createVector(x, y);
        if (iteration == 3 || iteration == 2) {
          dir = p5.Vector.mult(perpendicular, random(1, -1));
          dir.add(random(-0.5, 0.5));
        }
        
        if (iteration == 1) {
          dir = originalVel.normalize();
          dir.add(random(-0.5, 0.5));
        }
        
        let part;
        switch (iteration) {
          case 1: part = setupParticle(new Shrapnel(spawnPos), dir, color('white'), random(2, 5), 0); break;
          case 2: part = setupParticle(new Shrapnel(spawnPos), dir, color('white'), random(2, 5), 0); break;
          case 3: part = setupParticle(new BigShrapnel(spawnPos), dir, color('white'), random(5, 10), 600); break;
          case 4: part = setupParticle(new MeteorChunk(spawnPos), dir, colour, random(5, 10), 600);break;
        }
        
        if (iteration == 2) {
          part.gravity = 0;
        }
      }
    }
  }
  
  spawnScoreParticle(score, spawnPos, force, life, colour, dir, rot, scale, isMultiplier) {
    if (gameState.demoMode) {
      return;
    }
    
    let scoreParticle = new TextParticle(spawnPos.copy());
    scoreParticle.text = (isMultiplier ? "x" : "+") + score;
    if (scale != 1) {
      scoreParticle.scale = scale;
    }
    scoreParticle.colour = colour;
    scoreParticle.vel = dir;
    scoreParticle.vel.mult(force);
    if (rot != 0) {
      scoreParticle.rotSpeed = rot;
    }
    scoreParticle.remainingTicks = life;
    this.particles.push(scoreParticle);
  }
  
  spawnTextParticle(text, spawnPos, force, life, colour, dir, rot, scale) {
    if (gameState.demoMode) {
      return;
    }
    
    let textPart = new TextParticle(spawnPos);
    textPart.text = text;
    textPart.colour = colour;
    textPart.scale = scale;
    textPart.rotSpeed = rot;
    textPart.vel = dir;
    textPart.vel.mult(force);
    this.particles.push(textPart);
  }
}

class EffectsContainer {
  constructor() {
    this.lasers = [];
    this.foregroundCity = new City(height, 255, false);
    this.backgroundCity = new City(height - 15, 60, true);
  }
  
  preUpdate() {
    this.backgroundCity.draw();
  }
  
  postUpdate() {
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      this.lasers[i].draw();
      this.lasers[i].life--;
    }
    this.lasers = this.lasers.filter(m => m.life > 0);

    this.foregroundCity.draw();
  }
}

class UI {
  constructor() {
    this.scorePos = createVector(60, 60);
    this.buttonPos = createVector(width / 3, height / 1.5);
    this.buttonSize = createVector(width / 3, height / 6);
    this.staticMeteorPos = createVector(10, 150);
    this.reset();
  }
  
  reset() {
    this.rankStampAngle = 0;
    this.rankStampRotSpeed = 0.02;
    this.staticMeteors = [];
    this.buttonVisible = false;
  }
  
  onMousePress() {
    if (!gameState.gameOver) {
      return;
    }
    
    if (this.buttonVisible || this.isMouseOverButton()) {
      restartGame();
    }
  }
  
  isMouseOverButton() {
    return mouseX > this.buttonPos.x && mouseX < this.buttonPos.x + this.buttonSize.x
       && mouseY > this.buttonPos.y && mouseY < this.buttonPos.y + this.buttonSize.y
  }
  
  draw(game) {
    if (game.demoMode) {
      this.drawDemoScreen();
      return;
    }
    
    if (game.gameOver) {
      this.drawEndScreen(game);  
    } else {
      this.drawScore(game.score);
      this.drawTime(game.time);
    }
  }
  
  drawDemoScreen() {
    push();
      textAlign(CENTER, CENTER);
      translate(width/2, height/1.25);
      noStroke();
      scale(3);
      fill(color(255));
      text("ASTROID ASSAULT", 0, 0);
    pop();
    
    push();
      textAlign(CENTER, CENTER);
      translate(width/2.25, height/2);
      noStroke();
      scale(1.5);
      fill(color(255));

      let txt = "Click to play!";
      let startY = 100;
      let startX = 0;
      for (let i = 0; i < txt.length; i++) {
        let x = startX + i * 10;
        let wave = sin(frameCount * 0.1 + i * 0.5) * 2;
        text(txt[i], x, startY + wave);
      }
    pop();
  }
  
  drawScore(score) {
    push();
      textAlign(CENTER, CENTER);  
      fill(255);
      noStroke();
      translate(this.scorePos.x, this.scorePos.y);
      strokeWeight(1);
      scale(2);
      text(score, 0, 0);
    pop();
    
    push();
      textAlign(CENTER, CENTER);  
      fill(255);
      noStroke();
      translate(this.scorePos.x, this.scorePos.y + 30);
      strokeWeight(1);
      scale(1);
      text("Score", 0, 0);
    pop();
  }
  
  drawTime(time) {
    push();
      translate(width - 100, 20);
      fill(255);
      noStroke();
      scale(1);
      let txt = time.toFixed(1) + " seconds left!";
      text(txt, 1, 1);
    pop();
    
    let barHeight = height - (height / 4);
    let currHeight = map(time, 0, GAME_TIME, 0, barHeight);
    fill(255);
    rect(width - 20, height - 70, 10, -currHeight);
    stroke(255);
    noFill();
    rect(width - 20, height - 70, 10, -barHeight);
  }
  
  drawEndScreen(game) {
    // Draw hit astroids first
    const astroidIntervalMs = 150;
    const timeToDisplayAstroidsMs = astroidIntervalMs * game.scoreHistory.length;
    const timeSinceEndMs = (millis() - game.endTimeMs);
    const numAstroidsToDisplay = min(timeSinceEndMs / astroidIntervalMs, game.scoreHistory.length);
    const showingAllAstroids = numAstroidsToDisplay == game.scoreHistory.length;
    
    let currentScore = 0;
    let currAstroidPos = this.staticMeteorPos.copy();
    for (let i = 0; i < numAstroidsToDisplay; i++) {
      const score = game.scoreHistory[i];
      const multiplier = game.comboHistory[i];
      
      // Add new static astroid
      if (i + 1 > this.staticMeteors.length) { 
        let colour = color(255);
        let size = 0;
        switch (score) {
          case 10: colour = color('white'); size = 25; break;
          case 20: colour = color(124,252,0); size = 20; break;
          case 50: colour = color(144, 213, 255); size = 15; break;
          case 100: colour = color('magenta'); size = 12; break;
        }
        
        particleContainer.spawnScoreParticle(
          score, 
          currAstroidPos.copy(), 
          5, 
          100, 
          color(red(colour), green(colour), blue(colour)), 
          createVector(0, -1), 
          0, 
          1,
          false);
        
        if (multiplier > 1) {
          particleContainer.spawnScoreParticle(
            multiplier, 
            currAstroidPos.copy(), 
            2.5, 
            100, 
            multiplier > 2 ? color('red') : color('gold'),
            createVector(0, 1),
            0,
            1,
            true
          );
        }
        
        let newMeteor = new StaticMeteor(colour, size);
        this.staticMeteors.push(newMeteor);
      }
      
      currentScore += game.scoreHistory[i] * game.comboHistory[i];
      this.staticMeteors[i].display(currAstroidPos);
      
      // Move onto new line if we ran out of room
      currAstroidPos.x += 20;
      if (currAstroidPos.x > width) {
        currAstroidPos.x = 10;
        currAstroidPos.y += 50;
      }
    }
    
    // Game over and score text
    push();
      textAlign(CENTER, CENTER); 
      translate(width / 2, 0);
      noStroke();
      fill(255);
      scale(4);
      text("GAME OVER", 0, 15);
    
      scale(0.7); 
      if (timeSinceEndMs > 250) {
        text("Score: " + currentScore, 0, 40);
      }
    pop();
    
    // Rank icon
    if (timeToDisplayAstroidsMs + gameState.endTimeMs + 500 < millis()) {   
      const rank = gameState.rank;
      const rankPos = width - (width / 6);
      
      push();
        const totalLen = (rank.text.length * 10);
        translate(rankPos - (totalLen / 2), -40);
        noStroke();
        scale(1.5);
        fill(color(rank.colour));

        let rankText = rank.text;
        let startY = 100;
        let startX = 0;
        for (let i = 0; i < rankText.length; i++) {
          let x = startX + i * 10;
          let wave = sin(frameCount * 0.1 + i * 0.5) * rank.bounce;
          text(rankText[i], x, startY + wave);
        }
      pop();
      
      if (rank.rotate) {
        this.rankStampAngle += this.rankStampRotSpeed;
        if (this.rankStampAngle > 0.5 || this.rankStampAngle < -0.5) {
          this.rankStampRotSpeed *= -1;
        }
      }

      push();
        textAlign(CENTER, CENTER);
        fill(color(rank.colour));
        noStroke();
        translate(rankPos + 60, 50);
        scale(2);
        // rotate(-0.7)
        text("Rank", 0, 0);
      pop();
      
      push();
        strokeWeight(2);
        stroke(color(rank.colour));
        fill(0);
        ellipse(rankPos, 50, 50, 50);  
      pop();

      push();
        textAlign(CENTER, CENTER);
        fill(color(rank.colour));
        noStroke();
        translate(rankPos, 50);
        scale(4);
        rotate(this.rankStampAngle)
        text(rank.letter, 0, 0);
      pop();
    }
    
    // Play again button
    if (timeToDisplayAstroidsMs + gameState.endTimeMs + 1000 < millis()) {
      push();
        if (this.isMouseOverButton()) {
          fill(255);
        } else {
          fill(0);
        }
        stroke(255);
        strokeWeight(1);
        rect(this.buttonPos.x, this.buttonPos.y, this.buttonSize.x, this.buttonSize.y);
      pop();

      push();
        textAlign(CENTER, CENTER);  
        noStroke();
        if (this.isMouseOverButton()) {
          fill(0);
        } else {
          fill(255);
        }
        translate(this.buttonPos.x + this.buttonSize.x / 2, this.buttonPos.y + this.buttonSize.y / 2);
        scale(4);
        text("Play Again?", 0, 0);
      pop();
      
      this.buttonVisible = true;
    }
  }
}

class Game {
  constructor() {
    this.demoMode = true;
    this.reset();
  }
  
  reset() {
    this.score = 0;
    this.time = GAME_TIME;
    this.gameOver = false;
    this.lastMeteorSpawnMS = 0;
    this.currentMeteorSpawnRate = METEOR_SPAWN_RATE_MS;
    this.hits = 0;
    this.misses = 0;
    this.endTimeMs = 0;
    this.scoreHistory = [];
    this.comboHistory = [];
    this.rank = rankingSetup[0];
    this.nextDemoLaserFire = 0;
  }
  
  addScore(value) {
    if (!this.gameOver) {
      this.score += value;
    }
  }
  
  onMousePress(inMouseX, inMouseY) {
    if (this.gameOver) {
      return;
    }
    
    const origin = createVector(width/2, height);
    const end = createVector(inMouseX, inMouseY);
    const normal = p5.Vector.sub(end, origin).normalize();
    const perpendicular = createVector(-normal.y, normal.x);
    
    // Spawn a laser for display
    vfxContainer.lasers.push(new Laser(origin.copy(), normal.copy()));
    
    // Loop through each meteor and find the ones who's hit radius is close enough to the laser line
    let hitMeteorIndexes = [];
    for (let i = particleContainer.meteors.length - 1; i >= 0; i--) {
      let meteor = particleContainer.meteors[i];
      let distToOriginOnNormal = p5.Vector.dot(normal, p5.Vector.sub(meteor.pos, origin));
      let closestPointOnNormal = p5.Vector.add(origin, p5.Vector.mult(normal, distToOriginOnNormal));
      let distToNormalSqrd = abs(p5.Vector.sub(meteor.pos, closestPointOnNormal).magSq());
      
      if (distToNormalSqrd < meteor.hitRadiusSqrd / 2) {
        hitMeteorIndexes.push(i);
      }
    }
    
    const hasHitSomething = hitMeteorIndexes.length > 0;
    const multiplier = hitMeteorIndexes.length;
    
    // Loop through each hit
    for (let i = 0; i < hitMeteorIndexes.length; i++) {
      
      const hitIndex = hitMeteorIndexes[i];
      const hitMeteor = particleContainer.meteors[hitIndex];
      const rawPoints = hitMeteor.points;
      const points = hitMeteor.points * multiplier;
      const colour = hitMeteor.colour;
      
      // Spawn a score particle on the score text
      particleContainer.spawnScoreParticle(
        points, 
        ui.scorePos, 
        5, 
        50, 
        colour,
        createVector(1 * random(1, -1), 1),
        random(-0.05, 0.05),
        1.5,
        false
      );
      
      // Another for the actual meteor
      particleContainer.spawnScoreParticle(
        rawPoints, 
        hitMeteor.pos, 
        3, 
        50, 
        colour,
        createVector(0, -1),
        0,
        1,
        false
      );
      
      if (multiplier > 1) {
        particleContainer.spawnScoreParticle(
          multiplier, 
          hitMeteor.pos, 
          1, 
          100, 
          multiplier > 2 ? color('red') : color('gold'),
          createVector(frameCount % 2 == 0 ? 1 : -1, -1),
          random(-0.08, 0.08),
          multiplier > 2 ? 2 : 1.5,
          true
        );
      }
      
      if (!this.demoMode) {
        // Add score
        this.addScore(points);
        this.scoreHistory.push(rawPoints);
        this.comboHistory.push(multiplier);
      }
      
      // Finally generate explosion and remove the meteor
      particleContainer.generateInAirExplosion(hitMeteor.pos, hitMeteor.mass, hitMeteor.vel, hitMeteor.colour, perpendicular);
      particleContainer.meteors.splice(hitIndex, 1);
    }
    
    if (multiplier > 1) {
      particleContainer.spawnTextParticle(
        COMBO_STRINGS[multiplier - 1], 
        createVector(width/2, height/2),
        5, 
        150, 
        multiplier > 2 ? color('red') : color('gold'),
        createVector(1, -1),
        random(-0.05, 0.05),
        multiplier > 2 ? 2 : 1.5
      );
    }

    // Spawn some flavour text if we hit something (or not)
    particleContainer.spawnTextParticle(
      hasHitSomething ? random(HIT_TEXT_ENTRIES) : random(MISS_TEXT_ENTRIES), 
      ui.scorePos, 
      5, 
      50, 
      hasHitSomething ? color('green') : color('red'),
      createVector(1 * hasHitSomething ? 1 : -1, -1),
      random(-0.05, 0.05),
      2
    );

    if (!this.demoMode) {
      if (hasHitSomething) {
        this.hits++;
      } else {
        this.misses++;
      }
    }
  }
  
  onGameOver() {
    this.endTimeMs = millis();
    
    this.rank = rankingSetup[0];
    for (let i = 0; i < rankingSetup.length; i++) {
      if (gameState.score >= rankingSetup[i].threshold && (i + 1 == rankingSetup.length || gameState.score < rankingSetup[i + 1].threshold)) {
        this.rank = rankingSetup[i];
      }
    }
  }
  
  tick() {
    let ms = millis();
    
    if (this.demoMode && this.nextDemoLaserFire < ms) {
      let target = createVector(random(0, width), random(0, height/2));
      if (frameCount % 2 == 0 && particleContainer.meteors.length > 0) {
        target = particleContainer.meteors[0].pos.copy();
      }
      this.onMousePress(target.x, target.y);
      this.nextDemoLaserFire = ms + random(1000, 1500);
    }
    
    if (!this.demoMode) {
      this.time -= deltaTime / 1000;
      if (this.time < 0 && !this.gameOver) {
        this.gameOver = true;
        this.onGameOver();
      }
    }
    
    if (ms > this.lastMeteorSpawnMS + this.currentMeteorSpawnRate || this.lastMeteorSpawnMS == 0) {
      let spawnStart = 0;
      let spawnEnd = width;
      
      const maxSpawnWidth = 800;
      if (width > maxSpawnWidth) {
        let padding = (width - maxSpawnWidth) / 2;
        spawnStart = padding;
        spawnEnd = width - padding;
      }

      particleContainer.spawnMeteor(createVector(random(spawnStart, spawnEnd)));
      this.lastMeteorSpawnMS = ms;
      if (this.gameOver) {
        this.currentMeteorSpawnRate = METEOR_SPAWN_RATE_MS;
      } else {
        this.currentMeteorSpawnRate = max(METEOR_SPAWN_RATE_MS * ((this.time / GAME_TIME)), 300);
      }
    }
    
  }
}

class Particle {
  constructor(spawnPos) {
    this.pos = spawnPos.copy();
    this.vel = createVector();
    this.acc = createVector();
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

class Meteor extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    
    this.mass = random(METEOR_MIN_MASS, METEOR_MAX_MASS);
    this.angle = 0;
    this.rotSpeed = random(-0.05, 0.05);
    this.vertices = [];
    this.hitRadius = this.mass / 10;
    this.hitRadiusSqrd = this.hitRadius * this.hitRadius;
      
    let percent = ((this.mass - METEOR_MIN_MASS) / (METEOR_MAX_MASS  - METEOR_MIN_MASS)) * 100;
    if (percent > 70) {
      this.points = 10
      this.colour = color(255);
    } else if (percent > 40) {
      this.points = 20
      this.colour = color(124,252,0);
    } else if (percent > 10) {
      this.points = 50;
      this.colour = color(144, 213, 255);
    } else {
      this.points = 100;
      this.colour = color('magenta');
    }
      
    this.generateShape();
  }
  
  generateShape() {
    let base = this.mass / 20;
    let count = random(5, 9);
    for (let i = 0; i <= count; i++) {
      let angle = TWO_PI * (i / count);
      let r = base + random(-5, 5);
      let vec = createVector(cos(angle) * r, sin(angle) * r);
      this.vertices.push(vec.copy());
    }
  }
  
  update() {
    super.update();
    
    this.angle += this.rotSpeed;
  }
  
  display() {
    push();
      fill(0);
      stroke(this.colour);
      strokeWeight(2);
      translate(this.pos.x, this.pos.y);
      rotate(this.angle);
      beginShape();
        for (let i = 0; i < this.vertices.length; i++) {
          vertex(this.vertices[i].x, this.vertices[i].y);
        }
      endShape(CLOSE); 
	pop();
    
    // stroke(255);
    // noFill();
    // circle(this.pos.x, this.pos.y, this.hitRadius);
    // push();
  }
}

class StaticMeteor {
  constructor(colour, size) {
    this.vertices = [];
    this.colour = colour;
    
    this.generate(size);
  }
  
  generate(size) {
    let base = size;
    let count = random(5, 9);
    for (let i = 0; i <= count; i++) {
      let angle = TWO_PI * (i / count);
      let r = base + random(-5, 5);
      let vec = createVector(cos(angle) * r, sin(angle) * r);
      this.vertices.push(vec.copy());
    }
  }
  
  display(pos) {
    push();
      stroke(this.colour);
      strokeWeight(2);
      fill(0);
      translate(pos.x, pos.y);
      beginShape();
        for (let i = 0; i < this.vertices.length; i++) {
          vertex(this.vertices[i].x, this.vertices[i].y);
        }
      endShape(CLOSE); 
	pop();
  }
}

class TextParticle extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    
    this.text = "";
    this.remainingTicks = 50;
    this.scale = 1;
    this.rotSpeed = 0;
    this.angle = 0;
  }
  
  getGravity() {
    return GRAVITY / 3;
  }
  
  update() {
    super.update();
    
    if (this.rotSpeed != 0) {
      this.angle += this.rotSpeed;
    }
  }
  
  display() {
    this.colour.setAlpha(map(this.remainingTicks, 0, 50, 0, 255));
    
    push();
      textAlign(CENTER, CENTER);  
      noStroke();
      translate(this.pos.x, this.pos.y);
      if (this.rotSpeed != 0) {  
        rotate(this.angle);
      }
      scale(this.scale);
      fill(this.colour);
      text(this.text, 0, 0);
    pop();
  }
}

class BigShrapnel extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    this.remainingTicks = EXPLOSION_PARTICLE_LIFESPAN;
  }
  
  getGravity() {
    return 0;
  }
  
  display() {
    let dir = this.vel.heading();
    let baseSize = 1;
    let size = map(this.vel.magSq(), 0, 50, baseSize, baseSize * 4);
    
    this.colour.setAlpha(map(this.remainingTicks, 0, EXPLOSION_PARTICLE_LIFESPAN, 0, 255));
    
    push();
      stroke(this.colour);
      //strokeWeight(2);
      fill(this.colour);
      translate(this.pos.x, this.pos.y); // Move origin to center
      rotate(dir);
      ellipse(0, 0, size, 4);
    pop();
  }
}

class SmallParticle extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    this.remainingTicks = EXPLOSION_PARTICLE_LIFESPAN;
  }
  
  display() {
    this.colour.setAlpha(map(this.remainingTicks, 0, EXPLOSION_PARTICLE_LIFESPAN, 0, 255));
    
    push();
      stroke(this.colour);
      point(this.pos.x, this.pos.y);
    pop();
  }
}

class Shrapnel extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    this.remainingTicks = EXPLOSION_PARTICLE_LIFESPAN;
    this.gravity = GRAVITY;
  }
  
  getGravity() {
    return this.gravity;
  }
  
  display() {
    this.colour.setAlpha(map(this.remainingTicks, 0, EXPLOSION_PARTICLE_LIFESPAN, 0, 255));
    super.display();
  }
}

class MeteorChunk extends Particle {
  constructor(spawnPos) {
    super(spawnPos);
    
    this.angle = 0;
    this.rotSpeed = random(-0.05, 0.05);
    this.vertices = [];
    
    this.generateShape();
  }
  
  generateShape() {
    let base = random(2, 10);
    let count = random(5, 9);
    for (let i = 0; i <= count; i++) {
      let angle = TWO_PI * (i / count);
      let r = base + random(-5, 5);
      let vec = createVector(cos(angle) * r, sin(angle) * r);
      this.vertices.push(vec.copy());
    }
  }
  
  update() {
    super.update();
    
    this.angle += this.rotSpeed;
  }
  
  display() {
    push();
      stroke(this.colour);
      strokeWeight(2);
      translate(this.pos.x, this.pos.y);
      rotate(this.angle);
      noFill();
      beginShape();
        for (let i = 0; i < this.vertices.length; i++) {
          vertex(this.vertices[i].x, this.vertices[i].y);
        }
      endShape(CLOSE); 
	pop();
  }
}

class Laser {
  constructor(start, dir) {
    this.start = createVector(width/2, height);
    this.end = start.copy();
    this.end.add(dir.mult(3000));
    this.life = 10;
    
    this.other = createVector(this.start.y, this.start.x);
    this.other.mult(3000);
  }
  
  draw() {
    push();
      stroke(color('red'));
      strokeWeight(random(3, 8));
      line(this.start.x, this.start.y, this.end.x, this.end.y);

      line(this.start.x, this.start.y, this.other.x, this.other.y);
    pop();
  }
}

class City {
  constructor(startHeight, alpha, spawnExtras) {
    this.colour = color(255, 255, 255, alpha);
    this.startHeight = startHeight;
    this.startVector = createVector();
    this.triangles = [];
    this.ellipses = [];
    this.buildingHeights = [];
    
    let buildingCount = random(30, 50);
    this.buildingWidth = width / buildingCount;
    for (let i = 0; i < buildingCount; i++) {
      this.buildingHeights.push(random(10, 30));
    }
    
    if (spawnExtras) {
      let triangleCount = random(3, 6);
      for (let i = 0; i < triangleCount; i++) {
        let base = random(20, width - 20);
        this.triangles.push(createVector(
          base,
          base + random(20, 30),
          height - random(50, 120)
        ));
      }
      
      let ellipseCount = random(3, 6);
      for (let i = 0; i < ellipseCount; i++) {
        let base = random(20, width - 20);
        this.ellipses.push(createVector(
          base,
          random(20, 30),
          random(50, 120)
        ));
      }
    }
  }
  
  draw() {
    this.startVector.x = 0;
    this.startVector.y = this.startHeight;

    for (let i = 0; i < this.triangles.length; i++) {
      push();
        stroke(this.colour);
        strokeWeight(1);
        fill(0);
        triangle(
          this.triangles[i].x, 
          this.startVector.y,
          this.triangles[i].y,
          this.startVector.y,
          this.triangles[i].x + ((this.triangles[i].y - this.triangles[i].x) / 2),
          this.triangles[i].z);
      pop();
    }
    
    for (let i = 0; i < this.ellipses.length; i++) {
      push();
        stroke(this.colour);
        strokeWeight(1);
        fill(0);
        ellipse(
          this.ellipses[i].x,
          this.startVector.y,
          this.ellipses[i].y,
          this.ellipses[i].z);
      pop();
    }
    
    // TODO: Could maybe render vertexes to be quicker?
    for (let i = 0; i < this.buildingHeights.length; i++) {
      push();
        stroke(this.colour);
        strokeWeight(1);
        fill(0);
        rect(this.startVector.x, this.startVector.y, this.buildingWidth, -this.buildingHeights[i]);
      pop();
      this.startVector.x += this.buildingWidth;
    }
  }
}