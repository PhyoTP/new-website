import { Outlet, Link, useSearchParams } from "react-router-dom";
import "./styles.css";
import Background from "./Background";
import useSWR from "swr";
import { useEffect, useState, useRef } from "react";
import { FiCloudOff, FiCloudRain } from "react-icons/fi";
import Buds from "./Buds";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Layout = () => {
    const [urlParams, setParams] = useSearchParams();
    const singaporeTime = new Date().toLocaleTimeString("en-SG", {
        timeZone: "Asia/Singapore",
        timeStyle: "short"
      });
    const currentHour = new Date().getHours();
    let time = "";
    const customTime = urlParams.get('time');
    if (customTime) {
        time = customTime;
    }else if (currentHour >= 0 && currentHour < 6) {
        time = "dusk";
    } else if (currentHour >= 6 && currentHour < 12) {
        time = "morning";
    } else if (currentHour >= 12 && currentHour < 17) {
        time = "afternoon";
    } else if (currentHour >= 17 && currentHour < 20) {
        time = "evening";
    } else if (currentHour >= 20 && currentHour < 24) {
        time = "night";
    }
    const { data } = useSWR("https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast", fetcher);
    const [ intensity, setIntensity ] = useState(0);
    const [ checkWeather, setCheck ] = useState(0);
    useEffect(() => {
        const rain = urlParams.get('rain');
        if (rain) {
            setIntensity(rain);
        }else if (data) {
            switch (data.data.items[0].forecasts[45].forecast){
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
        console.log(intensity);
    }, [data, checkWeather]);
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
        for(let i = 0; i <ca.length; i++) {
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
    const r = document.querySelector(":root")
    let currentTheme = getCookie("theme");
    if (currentTheme === "") {
        currentTheme = (currentHour < 6 || currentHour >= 20) ? "dark" : "light";
    }
    if (currentTheme === "dark") {
        r.style.setProperty("--background", "#000");
        r.style.setProperty("--foreground", "#fff");
        r.style.setProperty("--footer", "#333");
    }else if (currentTheme === "light") {
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
        "morning": [
            "PLX9tuOzNhuWMWTY7x4FtB7tDACYjLRkrs"
        ],
        "afternoon": [
            "PLX9tuOzNhuWM2w1_yK0fSTrIqQrke61Ac"
        ],
        "evening": [
            "PLX9tuOzNhuWOAtTdn8YcR2kTILtcSfQ71"
        ],
        "night": [
            "PLX9tuOzNhuWNYt90Z3N8xqHwHlrgDh_xf"
        ],
        "dusk": [
            "PLX9tuOzNhuWPvfNEpgeBD4UBCNAKPXJ9h"
        ]
    }
    return (
        <>

            <header>
            <label className="switch" aria-label="Change theme">
                <input type="checkbox" checked={theme} onChange={toggleTheme}/>
                <span className="slider"></span>
                <span className="grass"></span>
            </label>
                <div className="header">
                    <h1>{singaporeTime}</h1>
                    <p>Singapore time</p>
                </div>
                {data && (
                    <>
                    <div className="header">
                        <h1>{data.data.items[0].forecasts[45].forecast}</h1>
                        <p>Woodlands, Singapore</p>
                    </div>
                    <button onClick={toggleRain}>{
                        intensity > 0 ? <FiCloudRain className="icon"/> : <FiCloudOff className="icon"/>
                    }</button>
                    </>
                )}
            </header>
            <Background intensity={intensity} image={`./assets/${window.innerHeight > window.innerWidth ? "portraitPhotos" : "landscapePhotos"}/${time}.jpg`}/>
            <Outlet />
            <footer>
                <p>this is a work in progress</p>
                <hr />
                <nav>
                    <a href="https://github.com/PhyoTP">My GitHub profile</a>
                    <a href="https://github.com/PhyoTP/new-website">Star this on GitHub!</a>
                    <a href="https://bit.ly/ScootPlayz">My YouTube channel</a>
                </nav>
                <hr/>
                <Buds listId={urlParams.get("playlist") || playlists[time]?.[0]}/>
                <hr/>
                <p>by the way you see that {currentTheme === "dark" ? "moon" : "sun"} thing in the top left corner, that's a theme switcher you should try clicking on it</p>
                { intensity > 0 && (
                    <p>and also the clouds in the right hand corner toggle rain (if its affecting performance)</p>
                )}
                <hr/>
                <h2>some more stuff you could change about this website:</h2>
                <label htmlFor="time">Change the time of day:</label>
                <select id="time" onChange={(e) => {
                    const newTime = e.target.value;
                    setParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set('time', newTime);
                    return newParams;
                    });
                }} value={time}>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                    <option value="dusk">Dusk</option>
                </select>
                <br />
                <label htmlFor="rainChange">Change the rain intensity:</label>
                <input type="number" id="rainChange" min="0"/>
                <input type="submit" value="Change" onClick={() => {
                    const newRain = document.getElementById("rainChange").value;
                    const url = new URL(window.location.href);
                    url.searchParams.set('rain', newRain);
                    window.location.href = url.toString();
                }}/>
                <br />
                <label htmlFor="playlistChange">Change the YouTube playlist:</label>
                <input type="number" id="playlistChange" min="0"/>
                <input type="submit" value="Change" onClick={() => {
                    const newList = document.getElementById("playlistChange").value;
                    setParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set('playlist', newList);
                    return newParams;
                    });
                }}/>
            </footer>
        </>
    )
}

export default Layout;