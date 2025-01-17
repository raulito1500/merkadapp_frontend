import React from "react";
import { AccordionContext, Button, useAccordionButton } from "react-bootstrap";

function CustomToggle({ className, children, eventKey, callback }) {
    const { activeEventKey } = React.useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = activeEventKey === eventKey;

    return (
        <Button
            variant="link"
            onClick={decoratedOnClick}
            className={className + " " + (isCurrentEventKey ? "opened" : "closed")}
        >
            {children}
        </Button>

    );
}

export { CustomToggle }