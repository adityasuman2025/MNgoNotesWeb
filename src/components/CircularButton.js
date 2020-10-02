import React from "react";
import cx from "classnames";

function CircularButton(props) {
    return (
        <button
            onClick={props.onClick}
            className={cx("circularBtnContainer", props.className)}
        >
            {props.children}
        </button>
    )
}

export default CircularButton;