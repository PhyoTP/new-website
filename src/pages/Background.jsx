import React, {useRef, useEffect, useState} from "react";

const Background = ({intensity = 80, image = null, time}) => {
    const canvasRef = useRef(null);
    const startRef = useRef(null);
    const dropsRef = useRef([]);
    const animationFrameRef = useRef(null);
    const [ imageNum, setImageNum ] = useState(0);
    useEffect(() => {
        // Set the background image for the start section
        if (startRef.current) {
            let imNum = Math.floor(Math.random() * photosCount[time]) + 1
            setImageNum(imNum);
            startRef.current.style.backgroundImage = `url(${image || `./assets/photos/${time}/${imNum}.jpg`})`;
        }
        console.log(image)
    }, [time]);
    useEffect(() => {
        console.log(intensity);
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

            dropsRef.current = Array.from({length: intensity}, createDrop);

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
        } else {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrameRef.current);
        }
    }, [intensity]);
    const photosCount = {
        "morning": 10,
        "afternoon": 4,
        "evening": 5,
        "night": 6,
        "dark": 3
    }
    return (
        <div>
            <section id="start" ref={startRef} className="imageText">
                {/*<button><h1>{"<"}</h1></button><button><h1>{">"}</h1></button>*/}
            </section>
            <canvas id="rain" ref={canvasRef}/>
        </div>
    );
};

export default Background;
