import { Outlet, Link } from "react-router-dom";
import "./styles.css";
import Background from "./Background";

const Layout = () => {
    const singaporeTime = new Date().toLocaleTimeString("en-SG", {
        timeZone: "Asia/Singapore",
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
    return (
        <>
            <Background />
            <Outlet />
            <iframe style={{borderRadius: "12px", position: "fixed", top: "10px", right: "10px"}} src={`https://open.spotify.com/embed/playlist/${url}?utm_source=generator`} height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </>
    )
}

export default Layout;