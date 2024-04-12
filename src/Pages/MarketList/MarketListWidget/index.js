import React from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context";
import { Button, Card, ListGroup, Offcanvas, ProgressBar } from "react-bootstrap"
import { MarketListCreateSuggested } from "../MarketListCreateSuggested";
import moment from "moment";

function MarketListWidget() {
    const [lists, setLists] = React.useState([]);

    const {
        setLoading,
        show,
        setShow
    } = React.useContext(AppContext);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // const server = "https://merkadapp-ed7aeb2134b5.herokuapp.com";
                const server = "http://localhost:8080";
                const response = await fetch(`${server}/market-list`);
                console.log(response);
                if (response.ok) {
                    const data = await response.json();
                    data.map((list, index) => {
                        list.completedStatus = (list.completedItems / list.totalItems) * 100;
                        list.date = new Date(list.date);
                        return list;
                    });
                    setLists(data);
                } else {
                    throw new Error('Error al obtener los datos del servicio');
                }
            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(false);
        };
        fetchData();
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
                                key={index}
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
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <MarketListCreateSuggested />
                </Offcanvas.Body>
            </Offcanvas>
        </Card>
    )
}

export { MarketListWidget }