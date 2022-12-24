import React, { useEffect, useState } from "react";

export default function InstallPWABtn() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    useEffect(() => {
        const handler = e => {
            e.preventDefault();
            console.log("we are being triggered :D");
            setSupportsPWA(true);
            setPromptInstall(e);
        }

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("transitionend", handler);
    }, []);

    function handleClick(e) {
        e.preventDefault();
        if (!promptInstall) return;
        promptInstall.prompt();
    }
    console.log(supportsPWA, "supportsPWA")

    if (!supportsPWA) return <></>;
    return (
        <div className="pwaBtn" onClick={handleClick}>
            <img alt="pwaImg" src={require("../img/pwa.png")} width={67} height={50} />
            Install Web App
        </div>
    )
};