import React from "react";
import { useReactPWAInstall } from "mngo-project-tools";

export default function InstallPWABtn() {
    const { pwaInstall, supported, isInstalled } = useReactPWAInstall();
    console.log("supported isInstalled", supported(), isInstalled())

    function handleClick() {
        pwaInstall({ title: "Install MNgo Notes Web App" })
            .then(() => console.log("App installed successfully or instructions for install shown"))
            .catch(() => console.log("User opted out from installing"));
    }

    // if (!supported()) return <></>;
    return (
        <div className="pwaBtn" onClick={handleClick}>
            <img alt="pwaImg" src={require("../img/pwa.webp")} width={67} height={50} />
            Install Web App
        </div>
    )
}