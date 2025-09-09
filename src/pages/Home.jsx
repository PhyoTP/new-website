import { useEffect, useRef, useState } from "react";
import me from "../assets/me.png";

const Home = () => {
  const terminalRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (terminalRef.current) {
        if (index < "neofetch".length) {
          terminalRef.current.innerHTML += "neofetch"[index];
          setIndex((prev) => prev + 1); // use updater function
        } else {
          clearInterval(interval);
        }
      }
    }, 200);

    return () => clearInterval(interval); // cleanup
  }, [index]); // depend on index so it updates correctly

  return (
    <main>
      <h1>PhyoTP&apos;s personal corner of the internet</h1>
      <p className="terminal" ref={terminalRef}>
        <b>phyotp.dev</b>:~${" "}
      </p>
      {index === "neofetch".length && (
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
            <p><b>Favourite Projects:</b> <a href="https://multicards.phyotp.dev">Multicards</a><a href="https://app.swiftinsg.org/Academ">Academ</a></p>

          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
