import React, { useState } from "react";
import { Toast } from "react-bootstrap";
import { AppContext } from "../Context/app";

function Notifications() {
    const [show, setShow] = useState(false);

    const {
        notifications
    } = React.useContext(AppContext);

    return (
        <Toast.Container>
            {notifications ? notifications.map((item, index) => (
                <Toast
                    className="d-inline-block m-1"
                    bg="primary"
                    onClose={() => { setShow(false) }}
                    show={show}
                    delay={30000}
                    autohide
                >
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">{item.content}</strong>
                        <small>11 mins ago</small>
                    </Toast.Header>
                    <Toast.Body className="">
                        Hello, world! This is a toast message.
                    </Toast.Body>
                </Toast>
            )) : ""}

        </Toast.Container>
    )
}
export { Notifications };