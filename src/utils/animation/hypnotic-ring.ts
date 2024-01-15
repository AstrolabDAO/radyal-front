type Ring = {
  pos: [number, number];
  a: number;
  ca: number;
  av: number;
  r: number;
  color: string;
};

class HypnoticRing {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  ringCount: number;
  rings: Ring[] = [];

  w: number;
  h: number;
  vr: number;
  vmin: number;

  cam: { pos: [number, number] };

  constructor(ringCount = 25, canvas?: HTMLCanvasElement) {
    this.ringCount = ringCount;
    this.initCanvas(canvas);
    this.resize();
    window.addEventListener("resize", this.resize, false);
    this.ctx.translate(0.5, 0.5); // make lines crisp

    this.start();
  }

  initCanvas(canvas?: HTMLCanvasElement) {
    if (canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      return;
    }
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
  }

  start() {
    // objects generation and initialization
    this.cam = { pos: [0, 0] };
    this.rings = [];
    const n = this.ringCount;
    const spacingFactor = 3; // Adjust this value to control the spacing

    for (let i = n; i > 0; --i) {
      const radius =
        ((Math.pow(i / n, spacingFactor) + 2 / n) * this.vr) / spacingFactor;
      this.rings.push({
        pos: [0, 0],
        a: Math.random() * Math.PI * 2,
        ca: 0,
        av: (Math.PI / 4096) * (Math.random() - 0.5),
        r: radius,
        color: `hsl(${(360 * Math.random()) | 0}, 50%, 50%)`,
      });
    }
  }

  loop() {
    console.log("loop");
    console.log(this, this?.ctx ?? 'no ctx');
    this.ctx.fillStyle = "#1c1c1c";
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.save();
    this.ctx.translate(
      ((this.w / 2) | 0) - this.cam.pos[0],
      ((this.h / 2) | 0) - this.cam.pos[1]
    );

    this.rings[0].pos = [0, 0];
    for (let i = 1; i < this.rings.length; ++i) {
      const ring = this.rings[i];
      const parent = this.rings[i - 1];
      ring.a += ring.av;
      ring.ca = ring.a - parent.ca;
      const r = parent.r - ring.r;
      ring.pos = [
        parent.pos[0] + Math.cos(ring.ca) * r,
        parent.pos[1] + Math.sin(ring.ca) * r,
      ];
    }
    this.ctx.strokeStyle = "#444444";
    for (let i = 0; i < this.rings.length; ++i) {
      const {
        color,
        r,
        pos: [x, y],
      } = this.rings[i];
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }

    this.ctx.restore();
    requestAnimationFrame(this.loop);
  }

  resize() {
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
    this.vmin = Math.max(this.w, this.h) * 2;
    this.vr = this.vmin / 2;
  }
}

export default HypnoticRing;
