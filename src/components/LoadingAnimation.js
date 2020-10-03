
import React from "react";

export default function LoadingAnimation(props) {
    return props.loading ? (
        <center>
            <img
                alt="loading"
                className="loadingAnimation"
                src={require("../img/loader.gif")}
            />
        </center>
    ) : null;
}