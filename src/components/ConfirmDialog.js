import React from "react";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Transition } from "../utils";

export default function ConfirmDialog({
    isDialogOpen,
    animate,
    dialogText,
    dialogDetails,
    onClose,
    onConfirm,
}) {
    return (
        <Dialog
            open={isDialogOpen}
            onClose={onClose}
            TransitionComponent={animate ? Transition : undefined}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description" >
            <DialogTitle id="alert-dialog-title">{dialogText}</DialogTitle>

            {
                dialogDetails ?
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">{dialogDetails}</DialogContentText>
                    </DialogContent>
                    : null
            }

            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={onConfirm}>Yes</Button>
                <Button variant="outlined" color="primary" onClick={onClose}>No</Button>
            </DialogActions>
        </Dialog >
    )
}