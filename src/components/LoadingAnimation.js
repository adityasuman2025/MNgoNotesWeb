
import React from "react";

function LoadingAnimation(props) {
    return props.loading ? (
        <center>
            <img
                alt="loading"
                className="loadingAnimation"
                src={require("../img/loaders2.gif")}
            />
        </center>
    ) : null;
}

export default LoadingAnimation;