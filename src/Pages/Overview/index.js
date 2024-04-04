import React from "react";
import { MarketListWidget } from "../MarketList/MarketListWidget";
import { Col, Row } from "react-bootstrap";

function Overview() {
    return (
        <Row>
            <Col sm={6}>
                <MarketListWidget />
            </Col>
        </Row>
    )
}

export { Overview }