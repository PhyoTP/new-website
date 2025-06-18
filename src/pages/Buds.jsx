import { useEffect, useRef, useState } from 'react';
import Case from "../assets/case.svg";
import Dial from "../assets/dial.svg";

export default function Buds() {
    const playerRef = useRef(null);
    const [ready, setReady] = useState(false);
    // Refs for direct DOM access
    const dialRef = useRef(null);
    const budsRef = useRef(null);
    const [volume, setVolume] = useState(50); // Start at 50

    const increaseVolume = () => {
    if (volume < 100) {
        const newVol = Math.min(volume + 10, 100);
        setVolume(newVol);
        playerRef.current?.setVolume(newVol);
    }
    };

    const decreaseVolume = () => {
    if (volume > 0) {
        const newVol = Math.max(volume - 10, 0);
        setVolume(newVol);
        playerRef.current?.setVolume(newVol);
    }
    };

    useEffect(() => {
        const dial = dialRef.current;
        const buds = budsRef.current;
        let rotation = 0;
        let isPlaying = false;
        let scrollTimeout = null;
        let touchStartY = null;

        if (!dial || !buds) return;

        const handleClick = () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                play();
                console.log("Play");
            }
            else {
                pause();
                console.log("Pause");
            }
            dial.style.animation = "click 0.1s";
            setTimeout(() => {
                dial.style.animation = "";
            }, 100);
        };

        const handleWheel = (event) => {
            event.preventDefault();
            if (scrollTimeout) return;
            const direction = event.deltaY > 0 ? "down" : "up";
            rotation += direction === "up" ? 20 : -20;
            dial.style.setProperty("--spin", rotation + "deg");
            if (direction === "up") {
                increaseVolume();
            } else {
                decreaseVolume();
            }
            console.log(volume);
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
            }, 200);
        };

        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            if (touchStartY === null) return;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            if (Math.abs(deltaY) < 30) return;
            rotation += deltaY > 0 ? 20 : -20;
            dial.style.setProperty("--spin", rotation + "deg");
            touchStartY = null;
        };

        buds.addEventListener("click", handleClick);
        buds.addEventListener("wheel", handleWheel, { passive: false });
        buds.addEventListener("touchstart", handleTouchStart);
        buds.addEventListener("touchend", handleTouchEnd);

        return () => {
            buds.removeEventListener("click", handleClick);
            buds.removeEventListener("wheel", handleWheel);
            buds.removeEventListener("touchstart", handleTouchStart);
            buds.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);
    // Load YouTube IFrame API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
        } else if (window.YT && window.YT.Player) {
            createPlayer();
        }

        window.onYouTubeIframeAPIReady = createPlayer;

        function createPlayer() {
            playerRef.current = new window.YT.Player('yt-player', {
            height: '0',
            width: '0',
            playerVars: {
                listType: 'playlist',
                list: 'PLX9tuOzNhuWMWTY7x4FtB7tDACYjLRkrs',
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
            },
            events: {
                onReady: () => setReady(true),
            }
            });
        }
    }, []);


  const play = () => {
    playerRef.current?.playVideo();
  };

  const pause = () => {
    playerRef.current?.pauseVideo();
  };


  return (
    <div>
      {/* Hidden player */}
      <div id="yt-player" ></div>

        <div id="buds" ref={budsRef}>
            <img src={Case} id="case" />
            <img src={Dial} id="dial" ref={dialRef} />
        </div>
        {!ready && <p>Loading...</p>}
    </div>
  );
}
