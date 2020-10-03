import React from "react";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBar(props) {
    return (
        <Snackbar
            open={props.open}
            autoHideDuration={6000}
            onClose={props.handleClose}
        >
            <Alert onClose={props.handleClose} severity={props.type || "error"}>
                {props.msg}
            </Alert>
        </Snackbar>
    )
}