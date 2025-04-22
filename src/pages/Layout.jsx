import { Outlet, Link } from "react-router-dom";
import "./styles.css";
import Background from "./Background";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { FiCloudOff, FiCloudRain } from "react-icons/fi";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Layout = () => {
    const singaporeTime = new Date().toLocaleTimeString("en-SG", {
        timeZone: "Asia/Singapore",
        timeStyle: "short"
      });
    const currentHour = new Date().getHours();
    let url = "1lsyZ21mPgnfpg9PiTCc2L"
    if (currentHour >= 0 && currentHour < 6) {
        url = "3A7cFDnXiSZTzG2NT5P59x"
    } else if (currentHour >= 6 && currentHour < 12) {
        url = "4s1d7AhkFUVuf3dMFxQRDj"
    } else if (currentHour >= 12 && currentHour < 16) {
        url = "2wQWf33wW5rqzbd6aZ4zD8"
    } else if (currentHour >= 16 && currentHour < 20) {
        url = "1lsyZ21mPgnfpg9PiTCc2L"
    } else if (currentHour >= 20 && currentHour < 24) {
        url = "4gOJnIGxmZGqQpDEfJzYUu"
    }
    const { data } = useSWR("https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast", fetcher);
    const [ intensity, setIntensity ] = useState(0);
    const [ checkWeather, setCheck ] = useState(0);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
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
    if (getCookie("theme") === "dark") {
        r.style.setProperty("--background", "#000");
        r.style.setProperty("--foreground", "#fff");
        r.style.setProperty("--footer", "#333");
    }else if (getCookie("theme") === "light") {
        r.style.setProperty("--background", "#fff");
        r.style.setProperty("--foreground", "#000");
        r.style.setProperty("--footer", "#ccc");
    }
    const [theme, setTheme] = useState(getCookie("theme") == "light");
    const toggleTheme = (event) => {
        const checked = event.target.checked;
        if (checked) {
            r.style.setProperty("--background", "#fff");
            r.style.setProperty("--foreground", "#000");
            r.style.setProperty("--footer", "#ccc");
            setTheme(true);
            document.cookie = "theme=light; path=/";
        } else {
            r.style.setProperty("--background", "#000");
            r.style.setProperty("--foreground", "#fff");
            r.style.setProperty("--footer", "#333");
            setTheme(false);
            document.cookie = "theme=dark; path=/";
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
            <Background intensity={intensity}/>
            <Outlet />
            <footer>
                <p>this is a work in progress</p>
            </footer>
            <iframe style={{borderRadius: "12px", position: "fixed", bottom: "10px", right: "10px"}} src={`https://open.spotify.com/embed/playlist/${url}?utm_source=generator`} height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </>
    )
}

export default Layout;