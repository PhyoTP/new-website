import React, { useRef, useEffect } from "react";

const Background = ({ intensity = 80, image }) => {
  const canvasRef = useRef(null);
  const startRef = useRef(null);
  const dropsRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Set the background image for the start section
    if (startRef.current) {
      startRef.current.style.backgroundImage = `url(${image})`;
    }
  }, [image]);
  useEffect(() => {
    
    if (intensity > 0) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Create raindrops
    const createDrop = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 10 + Math.random() * 10,
      speed: 4 + Math.random() * 4,
    });

    dropsRef.current = Array.from({ length: intensity }, createDrop);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(0, 150, 255, 0.7)";
      ctx.lineWidth = 1;

      dropsRef.current.forEach((drop) => {
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

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Throttle resize event
    const handleResize = () => {
      clearTimeout(handleResize.timeout);
      handleResize.timeout = setTimeout(() => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }else{
    const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrameRef.current);
  }
  }, [intensity]);
  return (
    <div>
      <section id="start" ref={startRef}></section>
      <canvas id="rain" ref={canvasRef} />
    </div>
  );
};

export default Background;
