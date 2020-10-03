import React from "react";
import cx from "classnames";

export default function CircularButton(props) {
    return (
        <button
            onClick={props.onClick}
            className={cx("circularBtnContainer", props.className)}
        >
            {props.children}
        </button>
    )
}