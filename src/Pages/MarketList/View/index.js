import React from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../App/Context/app";
import moment from "moment";
import { useUtilities } from "../../../App/Context/utilities";


function MarketListView() {
    const { id } = useParams();

    const utilities = useUtilities();

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
            <Container>
                <Row>
                    <Col md={3}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Col key={list.id} xs={12} className="mb-0 py-1 d-flex justify-content-start align-items-center">
                                    <div className="progress-circle rounded-circle d-flex align-items-center justify-content-center" style={{ "--progress": list.completedStatus }}>
                                        <div className="progress-content rounded-circle d-inline-flex align-items-center justify-content-center bg-white">
                                            <i className="bi bi-basket fs-2"></i>
                                        </div>
                                    </div>
                                    <span className="d-flex flex-grow-1 flex-column ms-3">
                                        <strong>{moment(list.date).format('MMM Do')}</strong>
                                        <small className="text-body-secondary">{list.totalItems} items</small>
                                    </span>
                                    <span className="d-flex flex-grow-1 flex-column ms-3 text-body-secondary text-end">
                                        <strong className="text-primary">{ utilities.formatMoney(list.estimated)}</strong>
                                        <small>Estimated value</small>
                                    </span>
                                </Col>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={9}>
                        <ListGroup>
                            {list.items.map((item, index) => (
                                <ListGroup.Item
                                    as="label"
                                    key={item.id}
                                    className="d-flex gap-3 align-items-center py-3">
                                    <div className="pt-1 form-checked-content flex-grow-1">
                                        {item.quantity}<strong className="ms-1">{item.product_name}</strong>
                                        {item.where !== "" && item.value !== 0 ?
                                            <span className="d-block pt-1 flex-fill justify-content-start justify-content-sm-start">
                                                <small className="me-3 text-body-secondary">
                                                    <i className="text-primary me-0 bi bi-shop-window"></i> {item.where}
                                                </small>
                                                <small className="me-3 px-3 border-start border-end text-body-secondary">
                                                    <i className="text-primary me-0 bi bi-wallet2"></i> {utilities.formatMoney(item.value)}
                                                </small>
                                                <small className="me-3 text-body-secondary">
                                                    <i className="text-primary bi bi-calendar-event"></i> {moment(item.date).format("MMM D")}
                                                </small>
                                            </span>
                                            : ""}
                                    </div>
                                    <input
                                        className="form-check-input fs-4"
                                        type="checkbox"
                                        disabled={item.checked}
                                        defaultChecked={item.checked}
                                        onChange={(event) => checkItem(event, item.id)}
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col></Row>
            </Container> : ""}</>

    )
}

export { MarketListView }