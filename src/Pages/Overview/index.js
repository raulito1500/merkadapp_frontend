import React from "react";
import { MarketListWidget } from "../MarketList/Widget";
import { Card, Col, Row } from "react-bootstrap";
import { useUtilities } from "../../App/Context/utilities";
import { AppContext } from "../../App/Context/app";
import moment from "moment";

function Overview() {

    const utilities = useUtilities();

    const {
        api,
        setLoading, 
        pushNotifications
    } = React.useContext(AppContext);

    const [data, setData] = React.useState();

    React.useEffect(() => {
        setLoading(true);
        api
            .get(`/bills/byMonth`)
            .then((response) => {
                let newData = response.data;
                newData[0].total =  isNaN(newData[0].total) ? 0 : newData[0].total;
                newData[1].total =  isNaN(newData[1].total) ? 0 : newData[1].total;
                newData[0].variation = calculateVariation(newData);
                setData(newData);
            })
            .catch(error => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);

    const calculateVariation = (data) => {
        if (data[0].total === 0 && data[1].total === 0) {
            return 0;
        }
        if (data[1].total === 0) {
            return 100;
        }
        if (data[0].total === 0) {
            return -100;
        }
        return ((data[0].total - data[1].total) / data[1].total) * 100;
    }

    return (
        <Row>
            <Col md={6}>
                <Row>
                    {data ?
                        <Col xs={6} className="mb-3">
                            <Card className="shadow-sm">
                                <Card.Body className="d-flex flex-column">
                                    <h6 className="fw-normal text-muted mt-0 mb-3">Budget</h6>
                                    <div className="d-flex">
                                        <div className="feature-icon card-highlight">
                                            <i className="bi bi-graph-up-arrow"></i>
                                        </div>
                                        <div className="ps-2">
                                            <h3 className="mt-1 mb-0">{utilities.formatMoney(data[0].total)}</h3>
                                            <p className="text-muted mb-0">
                                                <span className={"mb-2 d-block fw-bold " + (data[0].variation < 0 ? "text-success" : "text-danger")}>
                                                    <i className={"bi " + (data[0].variation < 0 ? "bi-arrow-down-right " : "bi-arrow-up-right")}></i> {utilities.formatPercent(data[0].variation)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-muted text-nowrap">{moment(new Date(1, data[0].month - 1, 1)).format('MMMM')}</span>
                                </Card.Body>
                            </Card>
                        </Col>
                        : ""}
                    <Col xs={6} className="mb-3">
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