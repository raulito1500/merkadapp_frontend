import React from "react";
import { Col, Container, ListGroup, ProgressBar, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../App/Context";
import moment from "moment";

function MarketListView() {
    const { id } = useParams();

    const {
        api,
        setLoading
    } = React.useContext(AppContext);

    const [list, setList] = React.useState();

    React.useEffect(() => {
        setLoading(true);
        api
            .get(`/market-list/${id}`)
            .then((response) => {
                const data = response.data;
                data.completedItems = data.items.filter(item => !!item.checked).length;
                data.totalItems = data.items.length;
                data.completedStatus = (data.completedItems / data.totalItems) * 100;
                data.estimated = data.items.reduce((total, item) => total + item.value, 0);
                setList(data);
            })
            .catch(error => {
                console.log("se presentó un error: " + error);
            })
            .finally(() => setLoading(false));
    }, []);

    const checkItem = (event, idItem) => {
        const index = list.items.findIndex((item) => item.id === idItem);
        setLoading(true);
        api
            .put(`/market-list/${list.id}/check/${list.items[index].id}`)
            .then((response) => {
                list.items[index].checked = true;
                setList(list);
            })
            .catch(error => {
                console.log("se presentó un error: " + error);
            })
            .finally(() => setLoading(false));
    }
    return (
        <>{list ?
            <Container fluid>
                <Row>
                    <Col>
                        <h1>Market List
                            <span className="fs-6 text-muted"> ({moment(list.date).format('MMM Do')})</span>
                        </h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <h3 className="mt-3 mb-0 text-primary mb-2"><span className="fw-normal fs-6 text-muted">Estimated value: </span>${list.estimated}</h3>
                        <ProgressBar variant="success" className="w-100 mb-3" now={list.completedStatus} label={`${list.completedItems} of ${list.totalItems}`} />
                    </Col>
                    <Col md={9}>
                        <ListGroup>
                            {list.items.map((item, index) => (
                                <ListGroup.Item
                                    as="label"
                                    key={item.id}
                                    className="list-group-item d-flex gap-3">
                                    <span className="opacity-50 text-nowrap pt-1 flex-shrink-1">{item.quantity}</span>
                                    <span className="pt-1 form-checked-content flex-grow-1">
                                        <strong>{item.product_name}</strong>
                                        <div className="d-flex justify-content-between justify-content-sm-start">
                                            {item.where !== "" && item.value !== 0 ?
                                                <>
                                                    <small className="me-2 text-body-secondary">
                                                        <i className="me-1 bi bi-crosshair"></i> {item.where}
                                                    </small>
                                                    <small className="me-2 text-body-secondary">
                                                        <i className="me-1 bi bi-cash"></i> ${item.value}
                                                    </small>
                                                    <small className="me-2 text-body-secondary">
                                                        <i className="me-1 bi bi-calendar-event"></i> {moment(item.date).format("MMM D")}
                                                    </small>
                                                </>
                                                : ""}
                                        </div>
                                    </span>
                                    <input
                                        className="form-check-input flex-shrink-1"
                                        type="checkbox"
                                        disabled={item.checked}
                                        defaultChecked={item.checked}
                                        onChange={(event) => checkItem(event, item.id)}
                                        style={{ fontSize: "1.375em" }} />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col></Row>
            </Container> : ""}</>

    )
}

export { MarketListView }