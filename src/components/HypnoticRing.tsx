import { useEffect, useRef } from "react";

type Ring = {
  pos: [number, number],
  arc: number,
  velocity: number,
  r: number,
  color: string,
};

type HypnoticRingProps = {
  haveStrokeColor?: boolean,
  haveFillColor?: boolean,
  ringCount?: number,
  velocityFactor?: number,
};

const HypnoticRing = ({
  haveStrokeColor = false,
  haveFillColor = false,
  ringCount = 20,
  velocityFactor = 15,
}: HypnoticRingProps) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const w = window.innerWidth;
    const h = window.innerHeight;
    const scale = window.devicePixelRatio;
    canvas.width = w * scale;
    canvas.height = h * scale;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(scale, scale);

    const vr = Math.min(w, h);
    const rings: Ring[] = [];
    const spacingFactor = 1.5;
    const initialRadius = 2;

    ctx.lineWidth = 1.5;
    ctx.imageSmoothingQuality = 'high';

    for (let i = ringCount; i > 0; --i) {
      const radius = ((Math.pow(i / ringCount, spacingFactor) + initialRadius / ringCount) * vr) / spacingFactor;
      rings.push({
        pos: [0, 0],
        arc: Math.random() * Math.PI * 2,
        velocity: (Math.PI / 4096) * (Math.random() - 0.5) * velocityFactor,
        r: radius,
        color: `hsl(${360 * Math.random() | 0}, 50%, 50%)`,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h); // Clear the canvas
      ctx.save();
      rings.forEach((ring, index) => {
        if (index === 0) {
          ring.pos = [0, 0];
        } else {
          const parent = rings[index - 1];
          ring.arc += ring.velocity;
          const r = parent.r - ring.r;
          ring.pos = [
            parent.pos[0] + Math.cos(ring.arc) * r,
            parent.pos[1] + Math.sin(ring.arc) * r,
          ];
        }

        ctx.beginPath();
        const x = w / 2 + ring.pos[0];
        const y = h / 2 + ring.pos[1];
        ctx.arc(x, y, ring.r, 0, Math.PI * 2);
        const greyFillColor = `hsl(0, 0%, ${4 + (1 - index /rings.length) * 6 | 0}%)`;
        const greyStrokeColor = `hsl(0, 0%, ${6 + (1 - index /rings.length) * 8 | 0}%)`;

        ctx.fillStyle = haveFillColor ? ring.color : greyFillColor;
        ctx.fill();
        ctx.strokeStyle = haveStrokeColor ? ring.color : greyStrokeColor;
        ctx.stroke();
      });
      ctx.restore();
      requestAnimationFrame(animate);
    };

    animate();
  }, [ringCount, haveStrokeColor, haveFillColor, velocityFactor]);

  return (
    <div className="fixed w-screen h-screen top-0 bottom-0 z-0">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default HypnoticRing;
