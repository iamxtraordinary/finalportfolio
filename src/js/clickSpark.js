/* ============================================
   CLICKSPARK — Standalone Vanilla JS Component
   Dynamic color detection, canvas spark lines
   ============================================ */

export class ClickSpark {
  constructor(options = {}) {
    this.sparkSize = options.sparkSize || 12;
    this.sparkRadius = options.sparkRadius || 20;
    this.sparkCount = options.sparkCount || 8;
    this.duration = options.duration || 400;
    this.easing = options.easing || "ease-out";
    this.extraScale = options.extraScale || 1.0;

    this.sparks = [];
    this.startTime = null;
    this.animationId = null;

    this.initCanvas();
    this.attachListeners();
  }

  initCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "click-spark-canvas";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.resizeCanvas = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", this.resizeCanvas);
    this.resizeCanvas();
  }

  // Easing calculations matching original component
  easeFunc(t) {
    switch (this.easing) {
      case "linear":
        return t;
      case "ease-in":
        return t * t;
      case "ease-in-out":
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default: // ease-out
        return t * (2 - t);
    }
  }

  // Traverse DOM to find active background color and determine spark color dynamically
  getDynamicSparkColor(target) {
    let el = target;
    while (el && el !== document) {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        // Parse rgb/rgba values
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const r = parseInt(match[1], 10);
          const g = parseInt(match[2], 10);
          const b = parseInt(match[3], 10);
          // Calculate relative luminance
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          // If background is light (like white/beige), return charcoal, else return white
          return luminance > 0.6 ? "#1a1a1a" : "#ffffff";
        }
      }
      el = el.parentElement;
    }
    // Default fallback (white fits the periwinkle background perfectly)
    return "#ffffff";
  }

  attachListeners() {
    window.addEventListener("click", (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();
      const sparkColor = this.getDynamicSparkColor(e.target);

      const newSparks = Array.from({ length: this.sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / this.sparkCount,
        startTime: now,
        color: sparkColor,
      }));

      this.sparks.push(...newSparks);

      if (!this.animationId) {
        this.startTime = now;
        this.animationId = requestAnimationFrame((t) => this.draw(t));
      }
    });
  }

  draw(timestamp) {
    if (!this.startTime) {
      this.startTime = timestamp;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.sparks = this.sparks.filter((spark) => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= this.duration) {
        return false;
      }

      const progress = elapsed / this.duration;
      const eased = this.easeFunc(progress);

      const distance = eased * this.sparkRadius * this.extraScale;
      const lineLength = this.sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      this.ctx.strokeStyle = spark.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();

      return true;
    });

    if (this.sparks.length > 0) {
      this.animationId = requestAnimationFrame((t) => this.draw(t));
    } else {
      this.animationId = null;
    }
  }
}
