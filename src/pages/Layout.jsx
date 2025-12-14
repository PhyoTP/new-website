import {Outlet, useSearchParams} from "react-router-dom";
import "./styles.css";
import Background from "./Background";
import useSWR from "swr";
import {useEffect, useState, useRef} from "react";
import {FiCloudOff, FiCloudRain} from "react-icons/fi";
import Buds from "./Buds";
import {animate} from "animejs";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Layout = () => {
    const [urlParams, setParams] = useSearchParams();
    const clock = useRef();
    const [currentTime, setCurrentTime] = useState("");
    const [artist, setArtist] = useState("minecraft");
    const paramRef = useRef(urlParams);
    useEffect(() => {
        paramRef.current = urlParams;
    }, [urlParams]);
    const cloudRef1 = useRef();
    const cloudRef2 = useRef();
    // compute Singapore hour for initial render (guard window for SSR)
    const singaporeDateNow = typeof window !== "undefined"
        ? new Date().toLocaleString("en-SG", {timeZone: "Asia/Singapore"})
        : new Date().toLocaleString();
    const currentHour = new Date(singaporeDateNow).getHours();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            const singaporeParts = new Intl.DateTimeFormat("en-SG", {
                timeZone: "Asia/Singapore",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false
            }).formatToParts(now);

            const currentHour = Number(
                singaporeParts.find(p => p.type === "hour").value
            );

            let time = "";
            if (paramRef.current.get("time")) {
                time = paramRef.current.get("time");
            } else if (currentHour < 6) {
                time = "dark";
            } else if (currentHour < 12) {
                time = "morning";
            } else if (currentHour < 17) {
                time = "afternoon";
            } else if (currentHour < 20) {
                time = "evening";
            } else {
                time = "night";
            }

            setCurrentTime(time);

            if (paramRef.current.get("artist")) {
                setArtist(paramRef.current.get("artist"));
            }

            if (clock.current) {
                clock.current.innerText = new Intl.DateTimeFormat("en-SG", {
                    timeZone: "Asia/Singapore",
                    timeStyle: "medium"
                }).format(now);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    const {data} = useSWR("https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast", fetcher);
    const [intensity, setIntensity] = useState(0);
    const [checkWeather, setCheck] = useState(0);
    useEffect(() => {
        const rain = urlParams.get('rain');
        if (rain) {
            setIntensity(rain);
            if (rain > 0){
                console.log(rain);
                setArtist("laufey")
            }
        } else if (data) {
            const forecast = data.data.items[0].forecasts[45].forecast;
            switch (forecast) {
                case "Light Showers":
                    setIntensity(50);
                    break;
                case "Passing Showers":
                    setIntensity(75);
                    break;
                case "Light Rain":
                    setIntensity(100);
                    break;
                case "Showers":
                    setIntensity(200);
                    break;
                case "Moderate Rain":
                    setIntensity(300);
                    break;
                case "Heavy Showers":
                    setIntensity(450);
                    break;
                case "Heavy Rain":
                    setIntensity(600);
                    break;
                case "Thundery Showers":
                    setIntensity(700);
                    break;
                case "Heavy Thundery Showers":
                    setIntensity(850);
                    break;
                case "Heavy Thundery Showers with Gusty Winds":
                    setIntensity(1000);
                    break;
            }
        }
        if (intensity > 0){
            console.log(intensity);
            setArtist("laufey")
        }
    }, [data, checkWeather, urlParams]);
    useEffect(() => {
        animate("header",{
            top: 0
        })
    }, []);
    const toggleRain = () => {
        if (intensity > 0) {
            setIntensity(0);
        } else {
            setCheck(checkWeather + 1);
        }
    }

    //themes
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    const r = typeof document !== "undefined" ? document.querySelector(":root") : null
    let currentTheme = getCookie("theme");
    if (currentTheme === "") {
        if (urlParams.get('theme')) {
            currentTheme = urlParams.get('theme');
        } else {
            currentTheme = (currentHour < 6 || currentHour >= 20) ? "dark" : "light";
        }
    }
    if (currentTheme === "dark") {
        r.style.setProperty("--background", "#000");
        r.style.setProperty("--foreground", "#fff");
        r.style.setProperty("--footer", "#333");
    } else if (currentTheme === "light") {
        r.style.setProperty("--background", "#fff");
        r.style.setProperty("--foreground", "#000");
        r.style.setProperty("--footer", "#ccc");
    }
    const [theme, setTheme] = useState(getCookie("theme") == "" ? (currentHour < 6 || currentHour >= 20 ? false : true) : getCookie("theme") === "light");
    const toggleTheme = (event) => {
        const checked = event.target.checked;
        if (checked) {
            r.style.setProperty("--background", "#fff");
            r.style.setProperty("--foreground", "#000");
            r.style.setProperty("--footer", "#ccc");
            setTheme(true);
            currentTheme = "light";
            document.cookie = "theme=light; path=/";
        } else {
            r.style.setProperty("--background", "#000");
            r.style.setProperty("--foreground", "#fff");
            r.style.setProperty("--footer", "#333");
            setTheme(false);
            currentTheme = "dark";
            document.cookie = "theme=dark; path=/";
        }
    }
    const playlists = {
        "minecraft": {
            "morning": "PLX9tuOzNhuWMWTY7x4FtB7tDACYjLRkrs",
            "afternoon": "PLX9tuOzNhuWM2w1_yK0fSTrIqQrke61Ac",
            "evening": "PLX9tuOzNhuWOAtTdn8YcR2kTILtcSfQ71",
            "night": "PLX9tuOzNhuWNYt90Z3N8xqHwHlrgDh_xf",
            "dark": "PLX9tuOzNhuWPvfNEpgeBD4UBCNAKPXJ9h"
        },
        "laufey": "PLX9tuOzNhuWNWtj0tWOLJ-1uKBI5inI_-",
        "yung kai":{
            "morning": "PLX9tuOzNhuWNT4sS1r99XEolSrlkPdNTY",
            "afternoon": "PLX9tuOzNhuWN6X61zppWrae_xMLk21YHc",
            "evening": "PLX9tuOzNhuWNUzZdrpj4RPslmLIp1O5c5",
            "night": "PLX9tuOzNhuWNyYibO1fQYJH0ecjH7qZ1-",
            "dark": "PLX9tuOzNhuWOmx85j70EN7ym4iYcga-2y"
        }
    }
    return (
        <>

            <header>
                <label className="switch" aria-label="Change theme">
                    <input type="checkbox" checked={theme} onChange={toggleTheme}/>
                    <span className="slider"></span>
                    <span className="grass"></span>
                </label>
                <div className="header imageText" ref={cloudRef1}>
                    <h1 ref={clock}>0:00:00</h1>
                    <p>Singapore time</p>
                </div>
                {data && (
                    <>
                        <div className="header imageText" ref={cloudRef2}>
                            <h1>{data.data.items[0].forecasts[45].forecast}</h1>
                            <p>Woodlands, Singapore</p>
                        </div>
                        <button onClick={toggleRain}>{
                            intensity > 0 ? <FiCloudRain className="icon"/> : <FiCloudOff className="icon"/>
                        }</button>
                    </>
                )}
            </header>
            <Background intensity={intensity}
                        time={currentTime}/>
            <Outlet/>
            <footer>
                <p>this is a work in progress</p>
                <hr/>
                <nav>
                    <a href="https://github.com/PhyoTP">My GitHub profile</a>
                    <a href="https://github.com/PhyoTP/new-website">Star this on GitHub!</a>
                    <a href="https://bit.ly/ScootPlayz">My YouTube channel</a>
                </nav>
                <hr/>
                <Buds listId={urlParams.get("playlist") || playlists[artist][currentTime] || playlists[artist]}/>
                <hr/>
                <p>by the way you see that {currentTheme === "dark" ? "moon" : "sun"} thing in the top left corner,
                    that's a theme switcher you should try clicking on it</p>
                {intensity > 0 && (
                    <p>and also the clouds in the right hand corner toggle rain (if its affecting performance)</p>
                )}
                <hr/>
                <h2>some more stuff you could change about this website:</h2>
                <br/>
                <label htmlFor="playlistChange">Set a YouTube playlist:</label>
                <input id="playlistChange"/>
                <input type="submit" value="Change" onClick={() => {
                    const newList = document.getElementById("playlistChange").value;
                    setParams(prev => {
                        const newParams = new URLSearchParams(prev);
                        newParams.set('playlist', newList);
                        return newParams;
                    });
                }}/>

                <iframe id="bucket-webring" style={{"width": "70%", "height": "3rem", "border": "none", "display": "block"}}
                            src={`https://webring.bucketfish.me/embed.html?name=PhyoTP${currentTheme === "light" && "&lightmode=true"}`} />
            </footer>
        </>
    )
}

export default Layout;