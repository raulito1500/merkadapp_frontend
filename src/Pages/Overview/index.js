import React from "react";
import { MarketListWidget } from "../MarketList/MarketListWidget";
import { Card, Col, Row } from "react-bootstrap";

function Overview() {
    return (
        <Row>
            <Col sm={6}>
                <Row>
                    <Col xs={6} lg={4} className="mb-3">
                        <Card className="card-highlight">
                            <Card.Body>
                                <h6 className="fw-normal text-white-50 mt-0">Budget</h6>
                                <h3 className="mt-3 mb-0 text-white">$395,211</h3>
                                <p className="text-white mb-0">
                                    <span className="text-success mb-2 d-block fw-bold">
                                        <i class="bi bi-arrow-up-right"></i> 105%
                                    </span>
                                    <span className="text-white-50 text-nowrap">April</span>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={6} lg={4} className="mb-3">
                        <Card>
                            <Card.Body>
                                <h6 className="fw-normal text-muted mt-0">Budget</h6>
                                <h3 className="mt-3 mb-0">$395,211</h3>
                                <p className="text-muted mb-0">
                                    <span className="text-danger mb-2 d-block fw-bold">
                                        <i class="bi bi-arrow-down-right"></i> 50%
                                    </span>
                                    <span className="text-nowrap">April</span>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>


            </Col>
            <Col sm={6}>
                <MarketListWidget />
            </Col>
        </Row>
    )
}

export { Overview }