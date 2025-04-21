import React, { useRef, useEffect, useState } from "react";

const Background = ({ intensity = 80 }) => {
  const canvasRef = useRef(null);
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const createDrop = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 10 + Math.random() * 10,
      speed: 4 + Math.random() * 4,
    });

    let drops = Array.from({ length: intensity }, createDrop);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(0, 150, 255, 0.7)";
      ctx.lineWidth = 1;

      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      });

      requestAnimationFrame(draw);
    };

    draw();

    // On resize
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [intensity]);

  return (
    <div className="relative w-full h-full">
      <section id="start"></section>
      <canvas id="rain" ref={canvasRef}/>
    </div>
  );
};

export default Background;
