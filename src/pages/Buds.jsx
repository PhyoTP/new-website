import {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import Case from "../assets/case.svg";
import Dial from "../assets/dial.svg";
import {animate} from "animejs";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Buds({listId}) {
    const playerRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    // Refs for direct DOM access
    const dialRef = useRef(null);
    const budsRef = useRef(null);
    const [volume, setVolume] = useState(50);
    const [currentTitle, setCurrentTitle] = useState("");
    const clickCountRef = useRef(0);
    const [progress, setProgress] = useState(0); // 0 to 100
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
    const next = useCallback(() => {
        if (playerRef.current && ready) {
            playerRef.current.nextVideo();
            setIsPlaying(true);
        }
    }, [ready]);
    const previous = useCallback(() => {
        if (playerRef.current && ready) {
            playerRef.current.previousVideo();
            setIsPlaying(true);
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
                height: '100',
                width: '100',
                playerVars: {
                    listType: 'playlist',
                    list: listId,
                    autoplay: 1,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    shuffle: 1,
                    loop: 1,
                    enablejsapi: 1
                },
                events: {
                    onReady: (event) => {
                        setReady(true);
                        // Set initial volume when player is ready
                        event.target.setVolume(50);
                        // Shuffle playlist on ready
                        event.target.setShuffle(true);
                        event.target.nextVideo();
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
    }, [listId]);

    // Handle dial interactions
    useEffect(() => {
        const dial = dialRef.current;
        const buds = budsRef.current;
        let rotation = 0;
        let scrollTimeout = null;
        let touchStartY = null;

        if (!dial || !buds) return;


        const handleClick = () => {
            playerRef.current.height = "1";
            dial.style.animation = "click 0.1s";
            setTimeout(() => {
                dial.style.animation = "";
            }, 100);

            clickCountRef.current += 1;
            console.log("Clicks:", clickCountRef.current);

            setTimeout(() => {
                const count = clickCountRef.current;

                if (count === 2) {
                    next();
                    console.log("Next");
                } else if (count === 3) {
                    previous();
                    console.log("Previous");
                } else if (count === 1) {
                    if (isPlaying) {
                        pause();
                        console.log("Paused");
                    } else {
                        play();
                        console.log("Playing");
                    }
                }

                clickCountRef.current = 0;
            }, 500);
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
    useEffect(() => {
        let interval = null;

        if (ready) {
            interval = setInterval(() => {
            const current = playerRef.current?.getCurrentTime?.();
            const duration = playerRef.current?.getDuration?.();

            if (current && duration) {
                const percent = (current / duration) * 100;
                setProgress(percent);
            }
            }, 1000); // update every second
        }

        return () => clearInterval(interval);
    }, [ready]);
    useEffect(() => {
        animate("#buds",{
            right: "10px"
        })
    }, [playerRef.current]);

    function cleanTitle(title) {
        return title
            .replace(/\(?official.*\)/i, "")
            .replace(/\(?lyric.*\)/i, "")
            .replace("-", "")
            .trim()
    }
    const artist = useMemo(()=>{
        if (!playerRef.current?.getVideoData() || !ready) return;

        const videoData = playerRef.current.getVideoData();
        console.log(videoData);
        return videoData.author
            .replace(" - Topic", "")
            .replace("VEVO", "")
            .trim();
    }, [currentTitle, ready]);
    const duration = useMemo(()=>{
        if (!playerRef.current || !ready) return;
        return Math.floor(playerRef.current.getDuration());
    }, [currentTitle, ready]);
    function artistRegex() {
        const pattern = artist.split("").join("\\s*");
        return new RegExp(pattern, "i");
    }
    const {data: lyricData} = useSWR(currentTitle !== "" ? `https://lrclib.net/api/search?q=${encodeURIComponent(artist.trim())} ${encodeURIComponent(cleanTitle(currentTitle).replace(artistRegex(), "").trim())}` : null, fetcher);
    const lyrics = useMemo(()=>{
        if (!lyricData) return null;
        const synced = lyricData.find(l => l.syncedLyrics)
        if (!synced) return null;
        const lines = synced.syncedLyrics.split("\n");
        const times = lines.map(line => line.split("]")[0].slice(1));
        const verses = lines.map(line => line.split("]")[1].trim());
        return [times, verses];
    },[lyricData])
    return (
        <div>

            <div id="buds" ref={budsRef} onClick={()=>console.log("Buds")}>
                <div id="yt-player"></div>
                <img src={Case} id="case" />
                <div id="budsInfo">
                    <img src={Dial} id="dial" ref={dialRef} />
                    {ready ? (
                        <div style={{padding:'0.5rem'}}>
                            <p>Status: {isPlaying ? 'Playing' : 'Paused'}</p>
                            <p>Volume: {volume}%</p>
                            <p>Now Playing: {currentTitle}</p>
                            <p>{Math.floor(progress/100*playerRef.current?.getDuration?.()/60)}:{Math.floor(progress/100*playerRef.current?.getDuration?.()%60) < 10 && "0"}{Math.floor(progress/100*playerRef.current?.getDuration?.()%60)} / {Math.floor(playerRef.current?.getDuration?.()/60)}:{Math.floor(playerRef.current?.getDuration?.()%60) < 10 && "0"}{Math.floor(playerRef.current?.getDuration?.()%60)}</p>
                        </div>
                    ) : <p>Loading...</p>}
                </div>
            </div>
            <h2>Buds</h2>
            <p>Based on the <a href="https://sg.nothing.tech/products/cmf-buds-pro-2?Colour=Orange">CMF Buds Pro 2</a> that I have (not sponsored, just a fan)</p>
            {ready ? (
                <div>
                    <p>Click to play/pause, scroll to adjust volume</p>
                    <p>Double click to next video, triple click to the video before</p>
                    <input
                        style={{width:'40%', minWidth:'130px'}}
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => {
                            const percent = parseFloat(e.target.value);
                            const duration = playerRef.current?.getDuration?.();
                            if (duration) {
                            const seekTo = (percent / 100) * duration;
                            playerRef.current?.seekTo(seekTo, true);
                            setProgress(percent);
                            }
                        }}
                    />
                    <p>{Math.floor(progress/100*playerRef.current?.getDuration?.()/60)}:{Math.floor(progress/100*playerRef.current?.getDuration?.()%60) < 10 && "0"}{Math.floor(progress/100*playerRef.current?.getDuration?.()%60)} / {Math.floor(playerRef.current?.getDuration?.()/60)}:{Math.floor(playerRef.current?.getDuration?.()%60) < 10 && "0"}{Math.floor(playerRef.current?.getDuration?.()%60)}</p>
                    {lyrics && (() => {
                        const duration = playerRef.current?.getDuration?.();
                        if (!duration) return null;

                        const currentTime = (progress / 100) * duration;

                        const index = lyrics[0].findIndex(time => {
                            const [m, s] = time.split(":").map(Number);
                            console.log([m * 60 + s, currentTime])
                            return m * 60 + s > currentTime;
                        })-1;
                        return index !== -1 ? <p>Lyrics: {lyrics[1][index]}</p> : null;
                    })()}
                </div>
            ) : <p>Loading...</p>}
        </div>
    );
}