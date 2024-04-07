import React from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context";
import { Button, Card, ListGroup, Offcanvas, ProgressBar } from "react-bootstrap"
import { MarketListCreateSuggested } from "../MarketListCreateSuggested";

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
                const server = "https://merkadapp-ed7aeb2134b5.herokuapp.com";
                // const server = "http://localhost:8080";
                const response = await fetch(`${server}/market-list/`);
                console.log(response);
                if (response.ok) {
                    const data = await response.json();
                    data.map((list, index) => list.completedStatus = (list.completedItems / list.totalItems) * 100);
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
            <Card.Header className="d-grid gap-2 d-md-flex justify-content-between">Recent market list
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
                                className="d-flex justify-content-between align-items-start">
                                {list.date}
                                <ProgressBar className="w-25" now={list.completedStatus} label={`${list.completedItems} of ${list.totalItems}`} />
                                <Link
                                    to={`/market-list/${list.id}`}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-box-arrow-up-right"
                                        viewBox="0 0 16 16">
                                        <path
                                            fillRule="evenodd"
                                            d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
                                        <path
                                            fillRule="evenodd"
                                            d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
                                    </svg>
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