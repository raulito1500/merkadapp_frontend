import React from "react";
import { MarketListWidget } from "../MarketList/Widget";
import { Card, Col, Row } from "react-bootstrap";

function Overview() {
    return (
        <Row>
            <Col md={6}>
                <Row>
                    <Col xs={6} className="mb-3">
                        <Card className="shadow-sm">
                            <Card.Body className="d-flex flex-column">
                                <h6 className="fw-normal text-muted mt-0 mb-3">Budget</h6>
                                <div className="d-flex">
                                    <div className="feature-icon card-highlight">
                                        <i className="bi bi-graph-up-arrow"></i>
                                    </div>
                                    <div className="ps-2">
                                        <h3 className="mt-1 mb-0">$395,211</h3>
                                        <p className="text-muted mb-0">
                                            <span className="text-danger mb-2 d-block fw-bold">
                                                <i className="bi bi-arrow-down-right"></i> 50%
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <span className="text-muted text-nowrap">April</span>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={6} className="mb-3">
                        <Card className="shadow-sm">
                            <Card.Body className="d-flex flex-column">
                                <h6 className="fw-normal text-muted mt-0 mb-3">Budget</h6>
                                <div className="d-flex">
                                    <div className="feature-icon card-highlight">
                                        <i className="bi bi-graph-up-arrow"></i>
                                    </div>
                                    <div className="ps-2">
                                        <h3 className="mt-1 mb-0">$395,211</h3>
                                        <p className="text-muted mb-0">
                                            <span className="text-danger mb-2 d-block fw-bold">
                                                <i className="bi bi-arrow-down-right"></i> 50%
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <span className="text-muted text-nowrap">April</span>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>


            </Col>
            <Col md={6} >
                <MarketListWidget />
            </Col>
        </Row>
    )
}

export { Overview }