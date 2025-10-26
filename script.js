window.onload = function() {
  const matrix = document.querySelector(".matrix");
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const fontSize = 22;

  // =======================
  // Música
  // =======================
  const music = document.getElementById("music");
  let musicStarted = false;
  document.addEventListener("click", () => {
    if (!musicStarted) {
      music.currentTime = 30; // inicia a música a partir de 30 segundos
      music.play();
      musicStarted = true;
    }
  });

  // =======================
  // Paleta de cores
  // =======================
  const colorPicker = document.getElementById("colorPicker");
  let textColor = colorPicker.value;
  colorPicker.addEventListener("input", () => {
    textColor = colorPicker.value;
  });

  // =======================
  // Chuva de texto "I love you"
  // =======================
  const matrixCanvas = document.createElement('canvas');
  matrixCanvas.width = screenWidth;
  matrixCanvas.height = screenHeight;
  matrixCanvas.style.position = 'absolute';
  matrixCanvas.style.top = '0';
  matrixCanvas.style.left = '0';
  matrixCanvas.style.zIndex = '0';
  matrix.appendChild(matrixCanvas);

  const ctxMatrix = matrixCanvas.getContext('2d');
  const text = "I love you my Maria";
  const columns = Math.floor(screenWidth / (fontSize * 1.3));

  const drops = new Array(columns).fill(0).map(() => Math.random() * screenHeight / fontSize);
  const speeds = new Array(columns).fill(0).map(() => 0.2 + Math.random() * 0.15);

  function drawMatrix() {
    // Limpa apenas o canvas da chuva, mantendo o fundo preto
    ctxMatrix.clearRect(0, 0, screenWidth, screenHeight);

    ctxMatrix.fillStyle = textColor;
    ctxMatrix.font = fontSize + "px Arial";
    ctxMatrix.shadowColor = textColor;
    ctxMatrix.shadowBlur = 10;

    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize * 1.3;
      const y = drops[i] * fontSize;
      ctxMatrix.fillText(text, x, y);

      drops[i] += speeds[i];
      if (y > screenHeight + fontSize) drops[i] = 0;
    }

    requestAnimationFrame(drawMatrix);
  }

  drawMatrix();

  // =======================
  // Fogos de artifício + "My Love"
  // =======================
  const fireworksCanvas = document.createElement("canvas");
  fireworksCanvas.width = screenWidth;
  fireworksCanvas.height = screenHeight;
  fireworksCanvas.style.position = "absolute";
  fireworksCanvas.style.top = "0";
  fireworksCanvas.style.left = "0";
  fireworksCanvas.style.zIndex = '1';
  matrix.appendChild(fireworksCanvas);

  const ctxFireworks = fireworksCanvas.getContext("2d");
  let fireworks = [];

  function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  class Firework {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.particles = [];
      this.textAlpha = 1;
      const colors = ["#ff007f", "#ff4fc3", "#ff99cc", "#ffffff", "#00ffff", "#ffff00"];
      for (let i = 0; i < 150; i++) {
        this.particles.push({
          x: x,
          y: y,
          angle: random(0, 2 * Math.PI),
          speed: random(1, 6),
          radius: random(1, 3),
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    update() {
      this.particles.forEach(p => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.alpha -= 0.02;
      });
      this.particles = this.particles.filter(p => p.alpha > 0);
      this.textAlpha -= 0.02;
    }

    draw() {
      this.particles.forEach(p => {
        ctxFireworks.beginPath();
        ctxFireworks.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctxFireworks.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.alpha})`;
        ctxFireworks.fill();
      });

      if (this.textAlpha > 0) {
        ctxFireworks.font = "28px cursive";
        const rgb = hexToRgb(textColor);
        ctxFireworks.fillStyle = `rgba(${rgb}, ${this.textAlpha})`;
        ctxFireworks.textAlign = "center";
        ctxFireworks.fillText("My Love 💗💗", this.x, this.y);
      }
    }
  }

  function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#",""),16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  }

  function animateFireworks() {
    ctxFireworks.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    fireworks.forEach(f => {
      f.update();
      f.draw();
    });

    fireworks = fireworks.filter(f => f.particles.length > 0 || f.textAlpha > 0);
    requestAnimationFrame(animateFireworks);
  }

  animateFireworks();

  document.addEventListener("click", e => {
    const fw = new Firework(e.clientX, e.clientY);
    fireworks.push(fw);
  });
};
