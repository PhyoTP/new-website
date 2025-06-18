import { useEffect, useRef, useState, useCallback } from 'react';
import Case from "../assets/case.svg";
import Dial from "../assets/dial.svg";

export default function Buds({listId}) {
    const playerRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    // Refs for direct DOM access
    const dialRef = useRef(null);
    const budsRef = useRef(null);
    const [volume, setVolume] = useState(50);
    const [currentTitle, setCurrentTitle] = useState("");
    
    // Use ref to store current volume for event handlers
    const volumeRef = useRef(volume);
    volumeRef.current = volume;

    const increaseVolume = useCallback(() => {
        const currentVol = volumeRef.current;
        if (currentVol < 100) {
            const newVol = Math.min(currentVol + 10, 100);
            setVolume(newVol);
            if (playerRef.current && ready) {
                playerRef.current.setVolume(newVol);
            }
        }
    }, [ready]);

    const decreaseVolume = useCallback(() => {
        const currentVol = volumeRef.current;
        if (currentVol > 0) {
            const newVol = Math.max(currentVol - 10, 0);
            setVolume(newVol);
            if (playerRef.current && ready) {
                playerRef.current.setVolume(newVol);
            }
        }
    }, [ready]);

    const play = useCallback(() => {
        if (playerRef.current && ready) {
            playerRef.current.playVideo();
            setIsPlaying(true);
        }
    }, [ready]);

    const pause = useCallback(() => {
        if (playerRef.current && ready) {
            playerRef.current.pauseVideo();
            setIsPlaying(false);
        }
    }, [ready]);

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
                    list: listId,
                    autoplay: 0, // Changed to 0 to avoid autoplay restrictions
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    shuffle: 1 // <-- Enable shuffle
                },
                events: {
                    onReady: (event) => {
                        setReady(true);
                        // Set initial volume when player is ready
                        event.target.setVolume(50);
                        // Shuffle playlist on ready
                        event.target.setShuffle(true);
                    },
                    onStateChange: (event) => {
                        // Update playing state based on YouTube player state
                        setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            const data = playerRef.current.getVideoData();
                            setCurrentTitle(data.title);
                        }
                    }
                }
            });
        }

        return () => {
            // Cleanup
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                playerRef.current.destroy();
            }
        };
    }, []);

    // Handle dial interactions
    useEffect(() => {
        const dial = dialRef.current;
        const buds = budsRef.current;
        let rotation = 0;
        let scrollTimeout = null;
        let touchStartY = null;

        if (!dial || !buds) return;

        const handleClick = () => {
            if (isPlaying) {
                pause();
                console.log("Pause");
            } else {
                play();
                console.log("Play");
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
            
            console.log("Volume:", volumeRef.current);
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
            
            if (deltaY > 0) {
                increaseVolume();
            } else {
                decreaseVolume();
            }
            
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
    }, [isPlaying, increaseVolume, decreaseVolume, play, pause]);

    return (
        <div>
            {/* Hidden player */}
            <div id="yt-player"></div>

            <div id="buds" ref={budsRef}>
                <img src={Case} id="case" />
                <img src={Dial} id="dial" ref={dialRef} />
            </div>
            <h1>Buds</h1>
            <p>Click the dial to play/pause, scroll or swipe to adjust volume</p>

            {!ready && <p>Loading...</p>}
            {ready && (
                <div style={{ marginTop: '10px', fontSize: '14px' }}>
                    <p>Status: {isPlaying ? 'Playing' : 'Paused'}</p>
                    <p>Volume: {volume}%</p>
                    <p>Click to play/pause, scroll to adjust volume</p>
                    <p>Now Playing: {currentTitle}</p>
                </div>
            )}
        </div>
    );
}