import React from "react";
import { Card, Col } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";
import { formatMoney } from "../../../utils/formatting";

function NextMarketListWidget({ nextMarketList }) {
    if (!nextMarketList || nextMarketList.date < Date.now() + 43200000) {
        return (
            <Card className="shadow-sm h-100">
                <Card.Body>
                    <h6 className="fw-normal text-muted mt-0 mb-3">Upcoming market list</h6>
                    <p className="text-muted">You don't have any market list. <Link to={"/market-list/create"}>¡Create one!</Link></p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm h-100">
            <Card.Body>
                <h6 className="fw-normal text-muted mt-0 mb-3">Next market list</h6>
                <Col xs={12} className="d-flex justify-content-start align-items-center">
                    <div
                        className="progress-circle rounded-circle d-flex align-items-center justify-content-center"
                        style={{ "--progress": nextMarketList.completedStatus }}
                    >
                        <div className="progress-content rounded-circle d-inline-flex align-items-center justify-content-center bg-white">
                            <i className="bi bi-basket fs-2"></i>
                        </div>
                    </div>
                    <span className="d-flex flex-grow-1 flex-column ms-3">
                        <strong>{moment(nextMarketList.date).format("MMM Do")}</strong>
                        <small className="text-body-secondary">{nextMarketList.totalItems} items</small>
                    </span>
                </Col>
                <Col xs={12} className="d-flex justify-content-start align-items-center">
                    <span className="d-flex flex-grow-1 flex-column ms-3 text-body-secondary text-end">
                        <strong className="text-primary">{formatMoney(nextMarketList.estimatedValue)}</strong>
                        <small>Estimated value</small>
                    </span>
                    <Link to={`/market-list/${nextMarketList.id}`}>
                        <i className="bi bi-arrow-right-circle text-primary ms-3 fs-2"></i>
                    </Link>
                </Col>
            </Card.Body>
        </Card>
    );
}
export { NextMarketListWidget };
