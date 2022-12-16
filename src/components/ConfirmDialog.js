import React from "react";
import { utils } from "mngo-project-toolss";

export default function ConfirmDialog({
    className,
    isDialogOpen,
    dialogText,
    dialogDetails,
    onClose,
    onConfirm,
}) {
    return (
        <>
            {
                !isDialogOpen ? null :
                    <>
                        <div className="dialogBackGrnd" onClick={onClose}></div>

                        <div className={utils.cx("dialog", className)}>
                            <div className="dialogHeader">
                                <div>{dialogText}</div>
                                <div className="dialogCloseBtn" onClick={onClose}>x</div>
                            </div>

                            <div className="dialogContent">
                                <div>{dialogDetails}</div>

                                <div className="dialogBtns">
                                    <button onClick={onConfirm}>Yes</button>
                                    <button className="dialogNo" onClick={onClose}>No</button>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>
    )
}