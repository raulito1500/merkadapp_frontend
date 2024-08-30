import React from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context";
import { Button, Card, Col, Offcanvas, Row } from "react-bootstrap"
import { MarketListCreateSuggested } from "../CreateSuggested";
import moment from "moment";

function MarketListWidget() {
    const [lists, setLists] = React.useState([]);

    const {
        api,
        setLoading,
        show,
        setShow
    } = React.useContext(AppContext);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const loadMarketList = () => {
        setLoading(true);
        api
            .get(`/market-list`)
            .then((response) => {
                setLists(
                    response.data.map((list, index) => {
                        list.completedStatus = (list.completedItems / list.totalItems) * 100;
                        list.date = new Date(list.date);
                        return list;
                    })
                );
            })
            .catch(error => {
                console.log("se presentó un error")
            })
            .finally(() => setLoading(false));
    }
    React.useEffect(() => {
        loadMarketList();
    }, []);

    return (
        <Col md={6} className="">
            <h5 className="">Recent market list</h5>
            <Button variant="outline-primary mb-3" size="sm" onClick={handleShow}>Add list</Button>
            <Card className="shadow-sm">
                <Card.Body>
                    <Row>
                        {
                            lists.map((list, index) => (
                                <Col key={list.id} xs={12} className="mb-3 d-flex justify-content-start align-items-center">
                                    <div className="progress-circle rounded-circle d-flex align-items-center justify-content-center" style={{ "--progress": list.completedStatus }}>
                                        <div className="progress-content rounded-circle d-inline-flex align-items-center justify-content-center bg-white">
                                            <i className="bi bi-basket fs-2"></i>
                                        </div>
                                    </div>
                                    <span className="d-flex flex-grow-1 flex-column ms-3">
                                        <strong>{moment(list.date).format('MMM Do')}</strong>
                                        <small className="text-body-secondary">{list.totalItems} items</small>
                                    </span>
                                    <span className="text-body-secondary">$165.000</span>
                                    <Link
                                        to={`/market-list/${list.id}`}
                                        className="ps-3">
                                        <i className="bi bi-arrow-right-circle"></i>
                                    </Link>
                                </Col>
                            ))}
                    </Row>
                </Card.Body>
            </Card>
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Body>
                    <MarketListCreateSuggested loadMarketList={loadMarketList} />
                </Offcanvas.Body>
            </Offcanvas>
        </Col>
    )
}

export { MarketListWidget }