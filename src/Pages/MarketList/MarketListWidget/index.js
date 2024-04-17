import React from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context";
import { Button, Card, ListGroup, Offcanvas, ProgressBar } from "react-bootstrap"
import { MarketListCreateSuggested } from "../MarketListCreateSuggested";
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

    React.useEffect(() => {
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
    }, [show]);
    // TODO: Buscar una mejor manera de recargar la el widget al guardar

    return (
        <Card>
            <Card.Header className="d-grid gap-2 d-flex justify-content-between">Recent market list
                <Button variant="outline-primary" size="sm" onClick={handleShow}>Add list</Button>
            </Card.Header>
            <Card.Body>
                <ListGroup
                    variant="flush">
                    {
                        lists.map((list, index) => (
                            <ListGroup.Item
                                as="li"
                                key={list.id}
                                className="ps-0"
                            >
                                <Link
                                    to={`/market-list/${list.id}`}
                                    className="ps-3 rounded-3 d-flex justify-content-between align-items-center text-decoration-none text-dark border-left-decorated">
                                    <span className="d-flex flex-column">
                                        <strong>{moment(list.date).format('MMM Do')}</strong>
                                        <small className="text-body-secondary">{list.totalItems} items</small>
                                    </span>
                                    <ProgressBar variant="success" className="w-50" now={list.completedStatus} label={`${list.completedItems} of ${list.totalItems}`} visuallyHidden />
                                </Link>
                            </ListGroup.Item>
                        ))}
                </ListGroup>
            </Card.Body>
            <Offcanvas show={show} onHide={handleClose} placement="end">

                <Offcanvas.Body>
                    <MarketListCreateSuggested />
                </Offcanvas.Body>
            </Offcanvas>
        </Card>
    )
}

export { MarketListWidget }