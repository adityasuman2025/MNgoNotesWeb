import React from "react";

export default function CircularButton(props) {
    return (
        <button
            onClick={props.onClick}
            className={["circularBtnContainer", props.className].join(" ")}
        >
            {props.children}
        </button>
    )
}