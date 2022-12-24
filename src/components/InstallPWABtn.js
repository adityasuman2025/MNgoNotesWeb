import React from "react";
import { usePWAInstall } from 'react-use-pwa-install'

export default function InstallPWABtn() {
    const pwaInstall = usePWAInstall();

    if (!pwaInstall) return <></>;
    return (
        <div className="pwaBtn" onClick={pwaInstall}>
            <img alt="pwaImg" src={require("../img/pwa.webp")} width={67} height={50} />
            Install Web App
        </div>
    )
}