import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import me from "../assets/me.png";

const Home = () => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const [urlParams, setParams] = useSearchParams();

  useEffect(() => {
    if (!urlParams.get("command")){
        const interval = setInterval(() => {
            if (index < "neofetch".length) {
            setText((prev) => prev + "neofetch"[index]);
            setIndex((prev) => prev + 1); // use updater function
            } else {
            clearInterval(interval);
            }
        }, 200);

        return () => clearInterval(interval); // cleanup
    } else {
        setText(urlParams.get("command"));
        setIndex("neofetch".length);
    }
  }, [index]); // depend on index so it updates correctly
  
  return (
    <main>
      {!urlParams.get("command") &&
        <h1>PhyoTP&apos;s personal corner of the internet</h1>
      }
      <p className="terminal"><b>phyotp.dev</b>:~$ {text}</p>
      {index === "neofetch".length && (
        <>
            <Output text={text}/>
            <p className="terminal"><b>phyotp.dev</b>:~$ <input type="text" ref={inputRef} onKeyDown={(e) => {
                if(e.key === "Enter"){
                    setText(inputRef.current.value);
                    inputRef.current.value = "";
                }
            }}/></p>
        </>
      )}
    </main>
  );
};

export default Home;

const Output = (props) => {
    const [urlParams, setParams] = useSearchParams();
    useEffect(() => {
        if (props.text.startsWith("time set")) {
            const time = props.text.split(" ")[2];
            setParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set('time', time);
                    return newParams;
                    });
        }else if (props.text.startsWith("weather")) {
            const weather = props.text.split(" ")[1];
            if (weather == "rain"){
                const intensity = props.text.split(" ")[2];
                setParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set('rain', intensity);
                    return newParams;
                });
            }
        }
    }, [props.text, setParams]);
    if (props.text === "neofetch"){
        return (
            <div className="neofetch">
                <img src={me} />
                <div className="terminal">
                    <p>
                    <b>Hi! I&apos;m Phyo Thet Pai</b>
                    </p>
                    <p>------------------------------------</p>
                    <p><b>Also known as:</b> TheAveragePi</p>
                    <p><b>Living in:</b> Singapore</p>
                    <p><b>IRL Languages:</b> English, Chinese, Burmese, Japanese</p>
                    <p><b>Hobbies:</b> Coding, Photography, Scooters, Gaming</p>
                    <p><b>I make:</b> Apps, Games, Websites</p>
                    <p><b>Favourite Project:</b> <a href="https://multicards.phyotp.dev">Multicards</a></p>
                    <p><b>Setup:</b> TravelMate Spin B311RN-32 (Linux Mint), iPad Air 4th Gen</p>
                    <p>------------------------------------</p>
                    <p><b>Commands:</b> neofetch, apps, websites, games, q, languages, frameworks</p>
                    <p>Run <b>help</b> to see more commands and info.</p>
                </div>
            </div>
        )
    }else if (props.text === "apps") {
        return (
            <nav>
                <a href="https://multicards.phyotp.dev">Multicards</a>
                <a href="https://app.swiftinsg.org/Academ">Academ</a>
            </nav>
        )
    }else if (props.text === "websites") {
        return (
            <nav>
                <a href="https://multicards.phyotp.dev">Multicards</a>
                <a href="https://auth.phyotp.dev">PhyoID</a>
                <a href="https://phyotp.dev">This one</a>
                <a href="https://phyotp.github.io">Old website</a>
                <a href="https://phyotp.github.io/5k1b1d1">5k1d1b1</a>
                <a href="https://phyotp.github.io/ArcOnline">ArcOnline</a>
            </nav>
        )
    }else if (props.text === "games") {
        return (
            <nav>
                <a href="https://phyotp.itch.io/Bouncer">Bouncer</a>
                <a href="https://www.roblox.com/share?code=c24371b39f9de146a3183c7205141a2d&type=ExperienceDetails&stamp=1718626359965">Find the Code Langs</a>
            </nav>
        )
    }else if (props.text === "help") {
        return (
            <div className="terminal">
                <p><b>Commands:</b></p>
                <p><b>neofetch</b> - Display info about me</p>
                <p><b>help</b> - Show this help message</p>
                <p><b>apps</b> - See apps I&apos;ve made</p>
                <p><b>websites</b> - See websites I&apos;ve made</p>
                <p><b>games</b> - See games I&apos;ve made</p>
                <p><b>q</b> - Quick links</p>
                <p><b>languages</b> - Languages I know</p>
                <p><b>frameworks</b> - Frameworks I know</p>
                <p><b>time set [morning/afternoon/evening/night/dark]</b> - Change time of day on this website</p>
            </div>
        )
    }else if (props.text === "q") {
        return (
            <nav>
                <a href="https://youtube.com/?authuser=1">YouTube</a>
                <a href="https://hackclub.slack.com">Slack</a>
                <a href="https://web.whatsapp.com">WhatsApp</a>
                <a href="https://chatgpt.com">ChatGPT</a>
                <a href="https://github.com">GitHub</a>
                <a href="https://mail.google.com/mail/u/0/#inbox">Gmail</a>
                <a href="https://notion.so">Notion</a>
                <a href="https://instagram.com">Instagram</a>
                <a href="https://classroom.google.com/u/0/h">Google Classroom</a>
            </nav>
        )
    }else if (props.text === "languages") {
        return (
            <div className="terminal">
                <p><b>General: </b>Python</p>
                <p><b>Web: </b>HTML, CSS, JavaScript, TypeScript</p>
                <p><b>Mobile: </b>Swift</p>
                <p><b>Game Dev: </b>C#, Lua, GDScript</p>
                <p><b>Other: </b>C, C++, SQL, Bash</p>
            </div>
        )
    }else if (props.text === "frameworks") {
        return (
            <div className="terminal">
                <p><b>Frontend: </b>React, Angular</p>
                <p><b>Backend: </b>Flask</p>
                <p><b>Mobile: </b>SwiftUI</p>
                <p><b>Game Dev: </b>Unity, Roblox, Godot</p>
                <p><b>Other: </b>Git</p>
            </div>
        )
    }else if (props.text.startsWith("time set")) {
        const time = props.text.split(" ")[2];
        return (
        <div className="terminal">
            <p>Time of day set to {time}.</p>
        </div>
        );
    }else if (props.text.startsWith("weather")) {
        const weather = props.text.split(" ")[1];
        if (weather == "rain"){
            return (
            <div className="terminal">
                <p>Rain intensity set to {props.text.split(" ")[2]}.</p>
            </div>
        )
    }
    }else if (props.text.trim() === "") {
        return null;
    }else {
        return (
            <div className="terminal">
                <p>Command not found: {props.text}</p>
                <p>Run <b>help</b> to see available commands.</p>
            </div>
        )
    }
}