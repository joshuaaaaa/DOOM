class DoomCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!this.shadowRoot.lastChild) {
      this._createCard();
    }
  }

  _createCard() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        background: #000;
      }
      .game-container {
        position: relative;
        width: 100%;
        height: 600px;
        background: #000;
        overflow: hidden;
        cursor: none;
      }
      canvas {
        display: block;
        width: 100%;
        height: 100%;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }
      .hud {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        color: #0f0;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        pointer-events: none;
      }
      .hud-section {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .health {
        color: #f00;
        font-weight: bold;
      }
      .ammo {
        color: #ff0;
      }
      .weapon {
        color: #0ff;
      }
      .menu {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        border: 3px solid #0f0;
        padding: 30px;
        color: #0f0;
        font-family: 'Courier New', monospace;
        text-align: center;
        display: none;
      }
      .menu.active {
        display: block;
      }
      .menu h2 {
        margin: 0 0 20px 0;
        font-size: 48px;
        text-shadow: 2px 2px #f00;
      }
      .menu button {
        background: #0f0;
        color: #000;
        border: none;
        padding: 15px 30px;
        font-size: 20px;
        font-family: 'Courier New', monospace;
        cursor: pointer;
        margin: 10px;
        font-weight: bold;
      }
      .menu button:hover {
        background: #0ff;
      }
      .crosshair {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        pointer-events: none;
      }
      .crosshair::before,
      .crosshair::after {
        content: '';
        position: absolute;
        background: #0f0;
      }
      .crosshair::before {
        left: 50%;
        top: 0;
        width: 2px;
        height: 100%;
        transform: translateX(-50%);
      }
      .crosshair::after {
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        transform: translateY(-50%);
      }
      .game-over {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(139, 0, 0, 0.95);
        border: 5px solid #f00;
        padding: 40px;
        color: #f00;
        font-family: 'Courier New', monospace;
        text-align: center;
        display: none;
        font-size: 24px;
      }
      .game-over.active {
        display: block;
      }
    `;

    const container = document.createElement('div');
    container.className = 'game-container';

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;

    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.innerHTML = `
      <div class="hud-section">
        <div class="health">HEALTH: <span id="health">100</span>%</div>
        <div class="weapon">WEAPON: <span id="weapon">PISTOL</span></div>
      </div>
      <div class="hud-section" style="text-align: right;">
        <div class="ammo">AMMO: <span id="ammo">50</span></div>
        <div>LEVEL: <span id="level">1</span></div>
      </div>
    `;

    const crosshair = document.createElement('div');
    crosshair.className = 'crosshair';

    const menu = document.createElement('div');
    menu.className = 'menu active';
    menu.innerHTML = `
      <h2>DOOM</h2>
      <p style="font-size: 18px; margin-bottom: 30px;">Click to start</p>
      <button id="start-btn">START GAME</button>
    `;

    const gameOver = document.createElement('div');
    gameOver.className = 'game-over';
    gameOver.innerHTML = `
      <h2 style="margin: 0 0 20px 0; font-size: 48px;">YOU DIED</h2>
      <p id="final-score" style="font-size: 20px; margin-bottom: 20px;"></p>
      <button id="restart-btn" style="background: #f00; color: #fff; border: none; padding: 15px 30px; font-size: 20px; font-family: 'Courier New', monospace; cursor: pointer; font-weight: bold;">RESTART</button>
    `;

    container.appendChild(canvas);
    container.appendChild(hud);
    container.appendChild(crosshair);
    container.appendChild(menu);
    container.appendChild(gameOver);

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);

    this._initGame(canvas);
  }

  _initGame(canvas) {
    const ctx = canvas.getContext('2d');
    const game = new DoomGame(canvas, ctx, this.shadowRoot);

    const startBtn = this.shadowRoot.getElementById('start-btn');
    const restartBtn = this.shadowRoot.getElementById('restart-btn');

    startBtn.addEventListener('click', () => {
      game.start();
    });

    restartBtn.addEventListener('click', () => {
      game.restart();
    });
  }

  getCardSize() {
    return 4;
  }
}

class DoomGame {
  constructor(canvas, ctx, shadowRoot) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.shadowRoot = shadowRoot;
    this.width = canvas.width;
    this.height = canvas.height;

    // Player
    this.player = {
      x: 3,
      y: 3,
      angle: 0,
      health: 100,
      maxHealth: 100,
      speed: 0.05,
      rotSpeed: 0.05
    };

    // Weapons
    this.weapons = [
      { name: 'PISTOL', damage: 15, ammo: Infinity, maxAmmo: Infinity, fireRate: 400, sound: 'pistol' },
      { name: 'SHOTGUN', damage: 45, ammo: 24, maxAmmo: 50, fireRate: 800, sound: 'shotgun' },
      { name: 'CHAINGUN', damage: 20, ammo: 100, maxAmmo: 200, fireRate: 100, sound: 'chaingun' }
    ];
    this.currentWeapon = 0;
    this.lastShot = 0;

    // Game state
    this.keys = {};
    this.mouseMovement = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.level = 1;
    this.score = 0;
    this.enemies = [];
    this.particles = [];

    // Ray casting settings
    this.fov = Math.PI / 3;
    this.numRays = 100; // Reduced from 120 for better performance
    this.maxDepth = 20;

    // Performance optimization
    this.lastFrameTime = 0;
    this.frameDelay = 1000 / 60; // Target 60 FPS

    // Map - 1 = wall, 0 = empty, 2 = door
    this.map = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    this._setupControls();
  }

  _setupControls() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!this.isRunning || this.isPaused) return;
      this.keys[e.key.toLowerCase()] = true;

      // Weapon switching
      if (e.key >= '1' && e.key <= '3') {
        const weaponIndex = parseInt(e.key) - 1;
        if (weaponIndex < this.weapons.length) {
          this.currentWeapon = weaponIndex;
          this._updateHUD();
        }
      }

      // Shoot with space
      if (e.key === ' ') {
        this._shoot();
        e.preventDefault();
      }

      // Pause
      if (e.key === 'Escape') {
        this._togglePause();
      }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Mouse movement - only when pointer is locked
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isRunning || this.isPaused) return;
      // Only use mouse movement if pointer is actually locked
      if (document.pointerLockElement === this.canvas) {
        this.mouseMovement = e.movementX || 0;
      }
    });

    // Mouse click - shoot if pointer locked, otherwise request lock
    this.canvas.addEventListener('click', (e) => {
      if (!this.isRunning) return;

      if (document.pointerLockElement !== this.canvas) {
        // Not locked yet, request pointer lock
        this.canvas.requestPointerLock();
      } else if (!this.isPaused) {
        // Pointer is locked and game is running, shoot
        this._shoot();
        e.preventDefault();
      }
    });

    // Pointer lock change event
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement !== this.canvas) {
        // Pointer lock was released, reset mouse movement
        this.mouseMovement = 0;
      }
    });
  }

  start() {
    this.shadowRoot.querySelector('.menu').classList.remove('active');
    this.isRunning = true;
    this.isPaused = false;
    this._spawnEnemies();
    this._updateHUD();
    this._gameLoop();
  }

  restart() {
    this.player.health = this.player.maxHealth;
    this.player.x = 3;
    this.player.y = 3;
    this.player.angle = 0;
    this.currentWeapon = 0;
    this.weapons[1].ammo = 24;
    this.weapons[2].ammo = 100;
    this.level = 1;
    this.score = 0;
    this.enemies = [];
    this.particles = [];
    this.shadowRoot.querySelector('.game-over').classList.remove('active');
    this.start();
  }

  _togglePause() {
    this.isPaused = !this.isPaused;
    const menu = this.shadowRoot.querySelector('.menu');
    if (this.isPaused) {
      menu.innerHTML = '<h2>PAUSED</h2><p style="font-size: 18px;">Press ESC to continue</p>';
      menu.classList.add('active');
      document.exitPointerLock();
    } else {
      menu.classList.remove('active');
      this.canvas.requestPointerLock();
    }
  }

  _spawnEnemies() {
    this.enemies = [];
    const numEnemies = 3 + this.level * 2;

    for (let i = 0; i < numEnemies; i++) {
      let x, y;
      do {
        x = Math.random() * (this.map[0].length - 2) + 1;
        y = Math.random() * (this.map.length - 2) + 1;
      } while (this.map[Math.floor(y)][Math.floor(x)] !== 0 ||
               (Math.abs(x - this.player.x) < 3 && Math.abs(y - this.player.y) < 3));

      this.enemies.push({
        x: x,
        y: y,
        health: 50 + this.level * 10,
        maxHealth: 50 + this.level * 10,
        speed: 0.02 + this.level * 0.005,
        damage: 10 + this.level * 2,
        lastAttack: 0,
        state: 'idle' // idle, chase, attack
      });
    }
  }

  _updateHUD() {
    this.shadowRoot.getElementById('health').textContent = Math.max(0, Math.floor(this.player.health));
    this.shadowRoot.getElementById('weapon').textContent = this.weapons[this.currentWeapon].name;
    const ammo = this.weapons[this.currentWeapon].ammo;
    this.shadowRoot.getElementById('ammo').textContent = ammo === Infinity ? '∞' : ammo;
    this.shadowRoot.getElementById('level').textContent = this.level;
  }

  _shoot() {
    const now = Date.now();
    const weapon = this.weapons[this.currentWeapon];

    if (now - this.lastShot < weapon.fireRate) return;
    if (weapon.ammo <= 0) return;

    this.lastShot = now;
    if (weapon.ammo !== Infinity) weapon.ammo--;

    // Play sound effect (simple beep)
    this._playSound(weapon.sound);

    // Ray cast to check for enemy hit
    const hitEnemy = this._checkEnemyHit();
    if (hitEnemy) {
      hitEnemy.health -= weapon.damage;
      this._createParticles(hitEnemy.x, hitEnemy.y, '#f00', 5);

      if (hitEnemy.health <= 0) {
        const index = this.enemies.indexOf(hitEnemy);
        if (index > -1) {
          this.enemies.splice(index, 1);
          this.score += 100 * this.level;
          this._createParticles(hitEnemy.x, hitEnemy.y, '#ff0', 15);

          // Check if level complete
          if (this.enemies.length === 0) {
            this.level++;
            setTimeout(() => this._spawnEnemies(), 1000);
          }
        }
      }
    }

    this._updateHUD();
  }

  _checkEnemyHit() {
    // Cast ray from player in looking direction
    const rayAngle = this.player.angle;
    const rayDirX = Math.cos(rayAngle);
    const rayDirY = Math.sin(rayAngle);

    // Check each enemy
    for (const enemy of this.enemies) {
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 10) continue;

      // Calculate angle to enemy
      const angleToEnemy = Math.atan2(dy, dx);
      let angleDiff = angleToEnemy - rayAngle;

      // Normalize angle
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      // Check if enemy is in crosshair (within small angle)
      if (Math.abs(angleDiff) < 0.1) {
        // Check line of sight - bullets should not pass through walls
        if (this._hasLineOfSight(this.player.x, this.player.y, enemy.x, enemy.y)) {
          return enemy;
        }
      }
    }

    return null;
  }

  _hasLineOfSight(x1, y1, x2, y2) {
    // Ray cast from point 1 to point 2 to check if there's a wall in between
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(distance * 10); // Check every 0.1 units

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const checkX = x1 + dx * t;
      const checkY = y1 + dy * t;

      const mapX = Math.floor(checkX);
      const mapY = Math.floor(checkY);

      if (mapX < 0 || mapX >= this.map[0].length ||
          mapY < 0 || mapY >= this.map.length ||
          this.map[mapY][mapX] === 1) {
        return false; // Wall blocks line of sight
      }
    }

    return true; // Clear line of sight
  }

  _createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        life: 30,
        color: color
      });
    }
  }

  _playSound(type) {
    // Simple audio synthesis
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    if (type === 'pistol') {
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
    } else if (type === 'shotgun') {
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
      oscillator.type = 'sawtooth';
    } else if (type === 'chaingun') {
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.type = 'square';
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  _gameLoop(currentTime = 0) {
    if (!this.isRunning) return;

    // Frame rate control - prevent excessive rendering
    const deltaTime = currentTime - this.lastFrameTime;

    if (deltaTime >= this.frameDelay) {
      this.lastFrameTime = currentTime - (deltaTime % this.frameDelay);

      if (!this.isPaused) {
        this._update();
        this._render();
      }
    }

    requestAnimationFrame((time) => this._gameLoop(time));
  }

  _update() {
    // Player movement
    const moveSpeed = this.player.speed;
    const rotSpeed = this.player.rotSpeed;

    // Rotation
    if (this.keys['j']) {
      this.player.angle -= rotSpeed;
    }
    if (this.keys['l']) {
      this.player.angle += rotSpeed;
    }

    // Mouse rotation
    if (this.mouseMovement !== 0) {
      this.player.angle += this.mouseMovement * 0.002;
      this.mouseMovement = 0;
    }

    // Forward/backward
    let newX = this.player.x;
    let newY = this.player.y;

    if (this.keys['i']) {
      newX += Math.cos(this.player.angle) * moveSpeed;
      newY += Math.sin(this.player.angle) * moveSpeed;
    }
    if (this.keys['k']) {
      newX -= Math.cos(this.player.angle) * moveSpeed;
      newY -= Math.sin(this.player.angle) * moveSpeed;
    }

    // Collision detection
    if (this.map[Math.floor(newY)][Math.floor(newX)] === 0) {
      this.player.x = newX;
      this.player.y = newY;
    }

    // Update enemies
    const now = Date.now();
    for (const enemy of this.enemies) {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 8) {
        enemy.state = 'chase';

        if (distance > 1) {
          // Move towards player
          const angle = Math.atan2(dy, dx);
          const newEnemyX = enemy.x + Math.cos(angle) * enemy.speed;
          const newEnemyY = enemy.y + Math.sin(angle) * enemy.speed;

          // Simple collision
          if (this.map[Math.floor(newEnemyY)][Math.floor(newEnemyX)] === 0) {
            enemy.x = newEnemyX;
            enemy.y = newEnemyY;
          }
        } else {
          // Attack player
          enemy.state = 'attack';
          if (now - enemy.lastAttack > 1000) {
            this.player.health -= enemy.damage;
            enemy.lastAttack = now;
            this._playSound('hurt');

            if (this.player.health <= 0) {
              this._gameOver();
            }
          }
        }
      } else {
        enemy.state = 'idle';
      }
    }

    // Update particles
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      return p.life > 0;
    });

    this._updateHUD();
  }

  _render() {
    // Clear screen
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Render ceiling with gradient
    const ceilingGradient = this.ctx.createLinearGradient(0, 0, 0, this.height / 2);
    ceilingGradient.addColorStop(0, '#2a2a4a');
    ceilingGradient.addColorStop(1, '#1a1a2a');
    this.ctx.fillStyle = ceilingGradient;
    this.ctx.fillRect(0, 0, this.width, this.height / 2);

    // Render floor with gradient
    const floorGradient = this.ctx.createLinearGradient(0, this.height / 2, 0, this.height);
    floorGradient.addColorStop(0, '#3a3a3a');
    floorGradient.addColorStop(1, '#1a1a1a');
    this.ctx.fillStyle = floorGradient;
    this.ctx.fillRect(0, this.height / 2, this.width, this.height / 2);

    // Ray casting with depth buffer
    const rayAngleStep = this.fov / this.numRays;
    const stripWidth = this.width / this.numRays;
    const depthBuffer = []; // Store wall distances for each vertical strip

    for (let i = 0; i < this.numRays; i++) {
      const rayAngle = this.player.angle - this.fov / 2 + i * rayAngleStep;
      const rayDirX = Math.cos(rayAngle);
      const rayDirY = Math.sin(rayAngle);

      let distance = 0;
      let hit = false;
      let hitSide = 0; // 0 = horizontal, 1 = vertical

      while (distance < this.maxDepth && !hit) {
        distance += 0.05; // Smaller steps for more accuracy
        const testX = this.player.x + rayDirX * distance;
        const testY = this.player.y + rayDirY * distance;

        const mapX = Math.floor(testX);
        const mapY = Math.floor(testY);

        if (mapX < 0 || mapX >= this.map[0].length ||
            mapY < 0 || mapY >= this.map.length ||
            this.map[mapY][mapX] === 1) {
          hit = true;

          // Determine which side was hit
          const hitX = testX - mapX;
          const hitY = testY - mapY;
          hitSide = (hitX < 0.1 || hitX > 0.9) ? 1 : 0;
        }
      }

      // Fix fisheye effect
      distance *= Math.cos(rayAngle - this.player.angle);
      depthBuffer[i] = distance;

      // Calculate wall height
      const wallHeight = this.height / distance;

      // Wall shading based on distance and side
      const brightness = Math.max(0, 255 - distance * 15);
      const sideBrightness = hitSide === 1 ? brightness * 0.7 : brightness;

      // Different colors for horizontal and vertical walls
      if (hitSide === 1) {
        this.ctx.fillStyle = `rgb(${sideBrightness * 0.8}, ${sideBrightness * 0.4}, ${sideBrightness * 0.3})`;
      } else {
        this.ctx.fillStyle = `rgb(${sideBrightness}, ${sideBrightness * 0.5}, ${sideBrightness * 0.3})`;
      }

      // Draw main wall
      const wallTop = (this.height - wallHeight) / 2;
      this.ctx.fillRect(
        i * stripWidth,
        wallTop,
        stripWidth + 1,
        wallHeight
      );

      // Add texture-like effect with vertical lines
      if (distance < 8) {
        const textureOffset = (Math.floor(distance * 10) % 2) * 10;
        this.ctx.fillStyle = `rgba(0, 0, 0, ${0.1 + distance * 0.02})`;
        for (let j = 0; j < wallHeight; j += 4) {
          if ((j + textureOffset) % 8 < 4) {
            this.ctx.fillRect(i * stripWidth, wallTop + j, stripWidth + 1, 2);
          }
        }
      }

      // Add edge highlighting
      if (i > 0 && Math.abs(depthBuffer[i] - depthBuffer[i - 1]) > 0.5) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(i * stripWidth, wallTop, 1, wallHeight);
      }
    }

    // Render enemies (sprite-like) - only if visible (not behind walls)
    for (const enemy of this.enemies) {
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 10) continue;

      // Check line of sight - don't render enemies behind walls
      if (!this._hasLineOfSight(this.player.x, this.player.y, enemy.x, enemy.y)) {
        continue;
      }

      const angle = Math.atan2(dy, dx) - this.player.angle;
      let normalizedAngle = angle;
      while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
      while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;

      if (Math.abs(normalizedAngle) > this.fov / 2 + 0.5) continue;

      const screenX = (normalizedAngle / this.fov + 0.5) * this.width;
      const spriteHeight = this.height / distance;
      const spriteWidth = spriteHeight;

      // Check depth buffer - don't render if behind a wall
      const stripIndex = Math.floor(screenX / stripWidth);
      if (stripIndex >= 0 && stripIndex < depthBuffer.length) {
        if (distance > depthBuffer[stripIndex]) {
          continue; // Enemy is behind a wall
        }
      }

      // Enemy color based on state with better shading
      let baseColor = { r: 0, g: 255, b: 0 }; // idle - green
      if (enemy.state === 'chase') baseColor = { r: 255, g: 255, b: 0 }; // yellow
      if (enemy.state === 'attack') baseColor = { r: 255, g: 0, b: 0 }; // red

      // Apply distance-based shading
      const enemyBrightness = Math.max(0.3, 1 - distance * 0.08);

      // Draw enemy with outline for better visibility
      const enemyX = screenX - spriteWidth / 2;
      const enemyY = (this.height - spriteHeight) / 2;

      // Draw detailed enemy sprite
      this._drawEnemySprite(enemyX, enemyY, spriteWidth, spriteHeight, baseColor, enemyBrightness, enemy.state, distance);

      // Health bar with border
      const healthBarWidth = spriteWidth;
      const healthBarHeight = 6;
      const healthPercent = enemy.health / enemy.maxHealth;
      const barX = enemyX;
      const barY = enemyY - 15;

      // Health bar border
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(barX - 1, barY - 1, healthBarWidth + 2, healthBarHeight + 2);

      // Health bar background (red)
      this.ctx.fillStyle = '#8b0000';
      this.ctx.fillRect(barX, barY, healthBarWidth, healthBarHeight);

      // Health bar foreground (green to yellow to red)
      const healthGradient = this.ctx.createLinearGradient(barX, barY, barX + healthBarWidth, barY);
      if (healthPercent > 0.5) {
        healthGradient.addColorStop(0, '#0f0');
        healthGradient.addColorStop(1, '#9f0');
      } else if (healthPercent > 0.25) {
        healthGradient.addColorStop(0, '#ff0');
        healthGradient.addColorStop(1, '#fa0');
      } else {
        healthGradient.addColorStop(0, '#f00');
        healthGradient.addColorStop(1, '#a00');
      }
      this.ctx.fillStyle = healthGradient;
      this.ctx.fillRect(barX, barY, healthBarWidth * healthPercent, healthBarHeight);
    }

    // Render particles
    for (const particle of this.particles) {
      const dx = particle.x - this.player.x;
      const dy = particle.y - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 10) continue;

      const angle = Math.atan2(dy, dx) - this.player.angle;
      let normalizedAngle = angle;
      while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
      while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;

      if (Math.abs(normalizedAngle) > this.fov / 2 + 0.5) continue;

      const screenX = (normalizedAngle / this.fov + 0.5) * this.width;
      const screenY = this.height / 2;

      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.life / 30;
      this.ctx.fillRect(screenX - 2, screenY - 2, 4, 4);
      this.ctx.globalAlpha = 1;
    }
  }

  _drawEnemySprite(x, y, width, height, baseColor, brightness, state, distance) {
    // Animation offset based on state and time
    const animTime = Date.now() * 0.005;
    const bounce = state === 'chase' ? Math.sin(animTime) * 2 : 0;

    // Shadow on ground - larger and more visible
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.beginPath();
    this.ctx.ellipse(x + width / 2, y + height + 3, width / 2.2, width / 9, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Body proportions - better proportions
    const headHeight = height * 0.22;
    const neckHeight = height * 0.05;
    const bodyHeight = height * 0.43;
    const legsHeight = height * 0.3;
    const headWidth = width * 0.55;
    const bodyWidth = width * 0.75;

    const bodyY = y + headHeight + neckHeight + bounce;

    // Outer glow for visibility
    if (distance < 4) {
      this.ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.2)`;
      this.ctx.fillRect(x - 3, y - 3, width + 6, height + 6);
    }

    // Main outline/shadow for depth
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(x - 2, y - 2, width + 4, height + 4);

    // === LEGS ===
    const legY = bodyY + bodyHeight;
    const legWidth = width * 0.28;
    const legOffset = state === 'chase' ? Math.sin(animTime * 2) * 4 : 0;
    const bootHeight = legsHeight * 0.25;

    // Left leg with gradient and detail
    const legGradientL = this.ctx.createLinearGradient(x + width * 0.18, legY, x + width * 0.18, legY + legsHeight);
    legGradientL.addColorStop(0, `rgb(${baseColor.r * brightness * 0.55}, ${baseColor.g * brightness * 0.55}, ${baseColor.b * brightness * 0.55})`);
    legGradientL.addColorStop(0.5, `rgb(${baseColor.r * brightness * 0.45}, ${baseColor.g * brightness * 0.45}, ${baseColor.b * brightness * 0.45})`);
    legGradientL.addColorStop(1, `rgb(${baseColor.r * brightness * 0.35}, ${baseColor.g * brightness * 0.35}, ${baseColor.b * brightness * 0.35})`);
    this.ctx.fillStyle = legGradientL;
    this.ctx.fillRect(x + width * 0.18, legY + legOffset, legWidth, legsHeight - bootHeight);

    // Left boot
    this.ctx.fillStyle = `rgb(${baseColor.r * brightness * 0.2}, ${baseColor.g * brightness * 0.2}, ${baseColor.b * brightness * 0.2})`;
    this.ctx.fillRect(x + width * 0.18, legY + legOffset + legsHeight - bootHeight, legWidth + 2, bootHeight);

    // Right leg with gradient and detail
    const legGradientR = this.ctx.createLinearGradient(x + width * 0.54, legY, x + width * 0.54, legY + legsHeight);
    legGradientR.addColorStop(0, `rgb(${baseColor.r * brightness * 0.55}, ${baseColor.g * brightness * 0.55}, ${baseColor.b * brightness * 0.55})`);
    legGradientR.addColorStop(0.5, `rgb(${baseColor.r * brightness * 0.45}, ${baseColor.g * brightness * 0.45}, ${baseColor.b * brightness * 0.45})`);
    legGradientR.addColorStop(1, `rgb(${baseColor.r * brightness * 0.35}, ${baseColor.g * brightness * 0.35}, ${baseColor.b * brightness * 0.35})`);
    this.ctx.fillStyle = legGradientR;
    this.ctx.fillRect(x + width * 0.54, legY - legOffset, legWidth, legsHeight - bootHeight);

    // Right boot
    this.ctx.fillStyle = `rgb(${baseColor.r * brightness * 0.2}, ${baseColor.g * brightness * 0.2}, ${baseColor.b * brightness * 0.2})`;
    this.ctx.fillRect(x + width * 0.54, legY - legOffset + legsHeight - bootHeight, legWidth + 2, bootHeight);

    // Knee details
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.fillRect(x + width * 0.19, legY + legOffset + legsHeight * 0.4, legWidth - 2, 2);
    this.ctx.fillRect(x + width * 0.55, legY - legOffset + legsHeight * 0.4, legWidth - 2, 2);

    // === BODY ===
    const bodyX = x + (width - bodyWidth) / 2;

    // Body gradient (main color) - vertical for better 3D effect
    const bodyGradient = this.ctx.createLinearGradient(bodyX, bodyY, bodyX + bodyWidth, bodyY);
    bodyGradient.addColorStop(0, `rgb(${baseColor.r * brightness * 0.85}, ${baseColor.g * brightness * 0.85}, ${baseColor.b * brightness * 0.85})`);
    bodyGradient.addColorStop(0.3, `rgb(${baseColor.r * brightness}, ${baseColor.g * brightness}, ${baseColor.b * brightness})`);
    bodyGradient.addColorStop(0.7, `rgb(${baseColor.r * brightness * 0.95}, ${baseColor.g * brightness * 0.95}, ${baseColor.b * brightness * 0.95})`);
    bodyGradient.addColorStop(1, `rgb(${baseColor.r * brightness * 0.65}, ${baseColor.g * brightness * 0.65}, ${baseColor.b * brightness * 0.65})`);
    this.ctx.fillStyle = bodyGradient;
    this.ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);

    // Chest armor plate (center)
    this.ctx.fillStyle = `rgba(0, 0, 0, 0.3)`;
    const chestWidth = bodyWidth * 0.4;
    const chestX = bodyX + (bodyWidth - chestWidth) / 2;
    this.ctx.fillRect(chestX, bodyY + bodyHeight * 0.1, chestWidth, bodyHeight * 0.5);

    // Chest armor highlight
    this.ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
    this.ctx.fillRect(chestX + 2, bodyY + bodyHeight * 0.12, chestWidth * 0.3, bodyHeight * 0.15);

    // Shoulder pads
    this.ctx.fillStyle = `rgb(${baseColor.r * brightness * 0.5}, ${baseColor.g * brightness * 0.5}, ${baseColor.b * brightness * 0.5})`;
    this.ctx.fillRect(bodyX - 2, bodyY, bodyWidth * 0.25, bodyHeight * 0.25);
    this.ctx.fillRect(bodyX + bodyWidth * 0.75 + 2, bodyY, bodyWidth * 0.25, bodyHeight * 0.25);

    // Belt
    this.ctx.fillStyle = `rgb(${baseColor.r * brightness * 0.25}, ${baseColor.g * brightness * 0.25}, ${baseColor.b * brightness * 0.25})`;
    this.ctx.fillRect(bodyX, bodyY + bodyHeight * 0.75, bodyWidth, bodyHeight * 0.12);

    // Belt buckle
    if (distance < 5) {
      this.ctx.fillStyle = '#888';
      this.ctx.fillRect(bodyX + bodyWidth * 0.45, bodyY + bodyHeight * 0.76, bodyWidth * 0.1, bodyHeight * 0.08);
    }

    // Side panels/ribs
    this.ctx.fillStyle = `rgba(0, 0, 0, 0.25)`;
    const ribSpacing = bodyHeight * 0.15;
    for (let i = 1; i < 4; i++) {
      this.ctx.fillRect(bodyX + 3, bodyY + i * ribSpacing, 2, bodyHeight * 0.1);
      this.ctx.fillRect(bodyX + bodyWidth - 5, bodyY + i * ribSpacing, 2, bodyHeight * 0.1);
    }

    // Arms
    const armWidth = width * 0.18;
    const armHeight = bodyHeight * 0.85;
    const armY = bodyY + bodyHeight * 0.12;
    const armSwing = state === 'attack' ? Math.sin(animTime * 4) * 6 : (state === 'chase' ? Math.sin(animTime * 1.5) * 5 : 0);
    const forearmHeight = armHeight * 0.55;

    // Left arm - upper arm
    const leftArmGradient = this.ctx.createLinearGradient(bodyX - armWidth, armY, bodyX, armY);
    leftArmGradient.addColorStop(0, `rgb(${baseColor.r * brightness * 0.5}, ${baseColor.g * brightness * 0.5}, ${baseColor.b * brightness * 0.5})`);
    leftArmGradient.addColorStop(1, `rgb(${baseColor.r * brightness * 0.65}, ${baseColor.g * brightness * 0.65}, ${baseColor.b * brightness * 0.65})`);
    this.ctx.fillStyle = leftArmGradient;
    this.ctx.fillRect(bodyX - armWidth, armY + armSwing, armWidth, armHeight - forearmHeight);

    // Left forearm
    this.ctx.fillStyle = `rgb(${baseColor.r * brightness * 0.55}, ${baseColor.g * brightness * 0.55}, ${baseColor.b * brightness * 0.55})`;
    this.ctx.fillRect(bodyX - armWidth, armY + armSwing + armHeight - forearmHeight, armWidth, forearmHeight);

    // Left hand/glove
    this.ctx.fillStyle = `rgb(${baseColor.r * brightness * 0.3}, ${baseColor.g * brightness * 0.3}, ${baseColor.b * brightness * 0.3})`;
    this.ctx.fillRect(bodyX - armWidth, armY + armSwing + armHeight - armHeight * 0.15, armWidth + 2, armHeight * 0.15);

    // Right arm - upper arm
    const rightArmGradient = this.ctx.createLinearGradient(bodyX + bodyWidth, armY, bodyX + bodyWidth + armWidth, armY);
    rightArmGradient.addColorStop(0, `rgb(${baseColor.r * brightness * 0.65}, ${baseColor.g * brightness * 0.65}, ${baseColor.b * brightness * 0.65})`);
    rightArmGradient.addColorStop(1, `rgb(${baseColor.r * brightness * 0.5}, ${baseColor.g * brightness * 0.5}, ${baseColor.b * brightness * 0.5})`);
    this.ctx.fillStyle = rightArmGradient;
    this.ctx.fillRect(bodyX + bodyWidth, armY - armSwing, armWidth, armHeight - forearmHeight);

    // Right forearm
    this.ctx.fillStyle = `rgb(${baseColor.r * brightness * 0.55}, ${baseColor.g * brightness * 0.55}, ${baseColor.b * brightness * 0.55})`;
    this.ctx.fillRect(bodyX + bodyWidth, armY - armSwing + armHeight - forearmHeight, armWidth, forearmHeight);

    // Right hand/glove
    this.ctx.fillStyle = `rgb(${baseColor.r * brightness * 0.3}, ${baseColor.g * brightness * 0.3}, ${baseColor.b * brightness * 0.3})`;
    this.ctx.fillRect(bodyX + bodyWidth, armY - armSwing + armHeight - armHeight * 0.15, armWidth + 2, armHeight * 0.15);

    // === NECK ===
    const neckX = x + width * 0.42;
    const neckWidth = width * 0.16;
    this.ctx.fillStyle = `rgb(${baseColor.r * brightness * 0.4}, ${baseColor.g * brightness * 0.4}, ${baseColor.b * brightness * 0.4})`;
    this.ctx.fillRect(neckX, y + headHeight + bounce, neckWidth, neckHeight);

    // === HEAD ===
    const headX = x + (width - headWidth) / 2;
    const headY = y + bounce;

    // Head/helmet gradient with better 3D effect
    const headGradient = this.ctx.createLinearGradient(headX, headY, headX + headWidth, headY);
    headGradient.addColorStop(0, `rgb(${baseColor.r * brightness * 0.75}, ${baseColor.g * brightness * 0.75}, ${baseColor.b * brightness * 0.75})`);
    headGradient.addColorStop(0.4, `rgb(${baseColor.r * brightness * 1.05}, ${baseColor.g * brightness * 1.05}, ${baseColor.b * brightness * 1.05})`);
    headGradient.addColorStop(0.6, `rgb(${baseColor.r * brightness}, ${baseColor.g * brightness}, ${baseColor.b * brightness})`);
    headGradient.addColorStop(1, `rgb(${baseColor.r * brightness * 0.55}, ${baseColor.g * brightness * 0.55}, ${baseColor.b * brightness * 0.55})`);
    this.ctx.fillStyle = headGradient;
    this.ctx.fillRect(headX, headY, headWidth, headHeight);

    // Helmet visor area (darker)
    this.ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
    this.ctx.fillRect(headX + headWidth * 0.12, headY + headHeight * 0.35, headWidth * 0.76, headHeight * 0.4);

    // Helmet top ridge
    this.ctx.fillStyle = `rgba(255, 255, 255, 0.25)`;
    this.ctx.fillRect(headX + headWidth * 0.1, headY + 2, headWidth * 0.8, headHeight * 0.15);

    // Helmet side vents
    if (distance < 5) {
      this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
      this.ctx.fillRect(headX + 2, headY + headHeight * 0.25, 3, headHeight * 0.15);
      this.ctx.fillRect(headX + headWidth - 5, headY + headHeight * 0.25, 3, headHeight * 0.15);
    }

    // Eyes (only if close enough) - better design
    if (distance < 7) {
      const eyeWidth = headWidth * 0.18;
      const eyeHeight = headHeight * 0.28;
      const eyeY = headY + headHeight * 0.42;

      // Eye glow based on state
      let eyeColor = { r: 0, g: 255, b: 0 }; // idle - green
      if (state === 'chase') eyeColor = { r: 255, g: 255, b: 0 }; // yellow
      if (state === 'attack') eyeColor = { r: 255, g: 0, b: 0 }; // red

      // Eye glow/aura effect (outer)
      if (state === 'attack' || state === 'chase') {
        const glowSize = state === 'attack' ? 3 : 2;
        this.ctx.fillStyle = `rgba(${eyeColor.r}, ${eyeColor.g}, ${eyeColor.b}, 0.3)`;
        this.ctx.fillRect(headX + headWidth * 0.24 - glowSize, eyeY - glowSize, eyeWidth + glowSize * 2, eyeHeight + glowSize * 2);
        this.ctx.fillRect(headX + headWidth * 0.58 - glowSize, eyeY - glowSize, eyeWidth + glowSize * 2, eyeHeight + glowSize * 2);
      }

      // Left eye - socket
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(headX + headWidth * 0.24, eyeY, eyeWidth, eyeHeight);

      // Left eye - glow gradient
      const leftEyeGradient = this.ctx.createRadialGradient(
        headX + headWidth * 0.24 + eyeWidth / 2, eyeY + eyeHeight / 2, 0,
        headX + headWidth * 0.24 + eyeWidth / 2, eyeY + eyeHeight / 2, eyeWidth / 2
      );
      leftEyeGradient.addColorStop(0, `rgb(${eyeColor.r}, ${eyeColor.g}, ${eyeColor.b})`);
      leftEyeGradient.addColorStop(0.7, `rgb(${eyeColor.r * 0.8}, ${eyeColor.g * 0.8}, ${eyeColor.b * 0.8})`);
      leftEyeGradient.addColorStop(1, `rgb(${eyeColor.r * 0.4}, ${eyeColor.g * 0.4}, ${eyeColor.b * 0.4})`);
      this.ctx.fillStyle = leftEyeGradient;
      this.ctx.fillRect(headX + headWidth * 0.24 + 1, eyeY + 1, eyeWidth - 2, eyeHeight - 2);

      // Right eye - socket
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(headX + headWidth * 0.58, eyeY, eyeWidth, eyeHeight);

      // Right eye - glow gradient
      const rightEyeGradient = this.ctx.createRadialGradient(
        headX + headWidth * 0.58 + eyeWidth / 2, eyeY + eyeHeight / 2, 0,
        headX + headWidth * 0.58 + eyeWidth / 2, eyeY + eyeHeight / 2, eyeWidth / 2
      );
      rightEyeGradient.addColorStop(0, `rgb(${eyeColor.r}, ${eyeColor.g}, ${eyeColor.b})`);
      rightEyeGradient.addColorStop(0.7, `rgb(${eyeColor.r * 0.8}, ${eyeColor.g * 0.8}, ${eyeColor.b * 0.8})`);
      rightEyeGradient.addColorStop(1, `rgb(${eyeColor.r * 0.4}, ${eyeColor.g * 0.4}, ${eyeColor.b * 0.4})`);
      this.ctx.fillStyle = rightEyeGradient;
      this.ctx.fillRect(headX + headWidth * 0.58 + 1, eyeY + 1, eyeWidth - 2, eyeHeight - 2);

      // Eye pupils/highlights
      if (distance < 4) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.fillRect(headX + headWidth * 0.26, eyeY + 2, eyeWidth * 0.3, eyeHeight * 0.25);
        this.ctx.fillRect(headX + headWidth * 0.60, eyeY + 2, eyeWidth * 0.3, eyeHeight * 0.25);
      }
    }

    // Weapon in hand (if attacking) - better weapon design
    if (state === 'attack' && distance < 8) {
      const weaponX = bodyX + bodyWidth;
      const weaponY = armY - armSwing + armHeight * 0.45;
      const weaponWidth = width * 0.3;
      const weaponHeight = width * 0.12;

      // Weapon barrel
      const barrelGradient = this.ctx.createLinearGradient(weaponX + armWidth, weaponY, weaponX + armWidth, weaponY + weaponHeight);
      barrelGradient.addColorStop(0, '#555');
      barrelGradient.addColorStop(0.5, '#777');
      barrelGradient.addColorStop(1, '#444');
      this.ctx.fillStyle = barrelGradient;
      this.ctx.fillRect(weaponX + armWidth, weaponY, weaponWidth * 0.7, weaponHeight);

      // Weapon grip
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(weaponX + armWidth - weaponWidth * 0.15, weaponY + weaponHeight * 0.3, weaponWidth * 0.25, weaponHeight * 0.8);

      // Weapon details
      this.ctx.fillStyle = '#999';
      this.ctx.fillRect(weaponX + armWidth + weaponWidth * 0.1, weaponY - 2, weaponWidth * 0.15, weaponHeight + 4);

      // Muzzle flash with better effect
      if (Math.sin(animTime * 10) > 0.7) {
        const flashIntensity = Math.abs(Math.sin(animTime * 15));

        // Outer flash (yellow)
        this.ctx.fillStyle = `rgba(255, 255, 0, ${0.7 * flashIntensity})`;
        this.ctx.fillRect(weaponX + armWidth + weaponWidth * 0.7, weaponY - weaponHeight, weaponWidth * 0.4, weaponHeight * 3);

        // Middle flash (orange)
        this.ctx.fillStyle = `rgba(255, 200, 0, ${0.8 * flashIntensity})`;
        this.ctx.fillRect(weaponX + armWidth + weaponWidth * 0.7, weaponY - weaponHeight * 0.5, weaponWidth * 0.5, weaponHeight * 2);

        // Inner flash (white)
        this.ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * flashIntensity})`;
        this.ctx.fillRect(weaponX + armWidth + weaponWidth * 0.7, weaponY, weaponWidth * 0.3, weaponHeight);

        // Flash particles
        if (distance < 5) {
          for (let i = 0; i < 3; i++) {
            const particleX = weaponX + armWidth + weaponWidth * 0.9 + Math.random() * weaponWidth * 0.3;
            const particleY = weaponY + Math.random() * weaponHeight;
            this.ctx.fillStyle = `rgba(255, ${200 + Math.random() * 55}, 0, ${flashIntensity})`;
            this.ctx.fillRect(particleX, particleY, 2, 2);
          }
        }
      }
    }

    // Final highlights for overall 3D effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    this.ctx.fillRect(headX + headWidth * 0.1, headY, headWidth * 0.25, headHeight * 0.5);
    this.ctx.fillRect(bodyX + bodyWidth * 0.25, bodyY, bodyWidth * 0.2, bodyHeight * 0.4);

    // Rim light effect on edge
    this.ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
    this.ctx.fillRect(x + width - 1, y, 1, height);
  }

  _gameOver() {
    this.isRunning = false;
    document.exitPointerLock();
    const gameOverDiv = this.shadowRoot.querySelector('.game-over');
    this.shadowRoot.getElementById('final-score').textContent =
      `Level ${this.level} - Score: ${this.score} - Kills: ${this.level * 3 - this.enemies.length}`;
    gameOverDiv.classList.add('active');
  }
}

customElements.define('doom-card', DoomCard);

// Announce card to Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'doom-card',
  name: 'DOOM Card',
  description: 'A retro DOOM-style first-person shooter game for Home Assistant'
});

console.info(
  '%c DOOM-CARD %c v1.0.0 ',
  'background-color: #f00; color: #fff; font-weight: bold;',
  'background-color: #000; color: #0f0; font-weight: bold;'
);
