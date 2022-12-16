import React from "react";
import { utils } from "mngo-project-toolss";

export default function CircularButton(props) {
    return (
        <button
            onClick={props.onClick}
            className={utils.cx("circularBtnContainer", props.className)}
        >
            {props.children}
        </button>
    )
}