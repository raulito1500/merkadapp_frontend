import React from "react";
import { Button, Card, Col, Container, Dropdown, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context/app";
import moment from "moment";
import { formatMoney } from "../../../utils/formatting";

function BillList() {
    const { api, setLoading, pushNotifications } = React.useContext(AppContext);
    const [merge, setMerge] = React.useState([]);
    const [listGrouped, setListGrouped] = React.useState([]);

    const groupBillsByDate = (bills) => {
        return bills.reduce((grouped, bill) => {
            const date = moment(bill.date).format("MMM Do, YYYY");
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(bill);
            return grouped;
        }, {});
    };

    const loadBills = () => {
        setLoading(true);
        api.get(`/bills`)
            .then((response) => {
                const data = groupBillsByDate(response.data);
                setListGrouped(data);
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        loadBills();
    }, []);

    const handleCheckMerge = (event, date, index) => {
        const updatedListGrouped = { ...listGrouped };
        const group = updatedListGrouped[date];
        const updatedItem = { ...group[index] };

        updatedItem.checked = event.target.checked;
        group[index] = updatedItem;
        updatedListGrouped[date] = group;
        setListGrouped(updatedListGrouped);

        if (event.target.checked) {
            setMerge([...merge, updatedItem.id]);
        } else {
            setMerge(merge.filter((id) => id !== updatedItem.id));
        }
    };

    const handleMerge = () => {
        if (merge.length < 2) {
            pushNotifications("Pick at least two bills to merge", null, "error");
            return;
        }

        const idDestination = merge[0];
        const idsOrigen = merge.slice(1);

        setLoading(true);
        api.put(`/bills/merge/${idDestination}`, idsOrigen)
            .then((response) => {
                pushNotifications("¡Great news! Bills have been merged", null, "success");
                loadBills();
            })
            .catch((error) => {
                pushNotifications("¡Ups! There was an error merging bills", error, "error");
            })
            .finally(() => {
                setMerge([]);
                setLoading(false);
            });
    };

    return (
        <>
            <h1>
                <Link to="/">
                    <i className="bi bi-arrow-left fs-5"></i>
                </Link>{" "}
                Bill list
            </h1>
            <Card className="my-3">
                <Card.Body className="py-2">
                    <InputGroup>
                        <InputGroup.Text className="border-0 bg-transparent">
                            <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control className="border-0" placeholder="Market, Apple" />
                        <Button className="text-secondary" variant="link">
                            <i className="bi bi-sort-down"></i>
                        </Button>
                        <Dropdown>
                            <Dropdown.Toggle bsPrefix="text-secondary" variant="link">
                                <i className="bi bi-collection"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="1">By date</Dropdown.Item>
                                <Dropdown.Item eventKey="2">By purchase location</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </InputGroup>
                </Card.Body>
            </Card>
            {merge.length > 0 ? (
                <Container
                    fluid
                    className="fixed-bottom p-3 pb-4 bg-white d-flex justify-content-between z-2"
                >
                    <Col className="d-flex flex-row align-items-center justify-content-between">
                        <Link className="p-2" to={"create"}>
                            Create
                        </Link>
                        <Button variant="outline-primary" onClick={handleMerge}>
                            Merge bills
                        </Button>
                    </Col>
                </Container>
            ) : (
                <></>
            )}
            {Object.keys(listGrouped).map((date, index) => (
                <Row key={index} className="px-2">
                    <h2>{date}</h2>
                    {listGrouped[date].map((item, index) => (
                        <Col key={index} xs={6} sm={4} md={3}>
                            <Card
                                className={
                                    "shadow-sm mb-3" +
                                    (item.checked ? " bg-accent-15 border-1 border-primary" : "")
                                }
                            >
                                <Card.Body>
                                    <input
                                        className="form-check-input fs-4 position-absolute top-0 start-100 translate-middle"
                                        type="checkbox"
                                        checked={item.checked || false}
                                        onChange={(event) => handleCheckMerge(event, date, index)}
                                    />
                                    <h3 className="fs-5 mb-2">
                                        <i className="bi bi-shop-window text-primary"></i> {item.where}
                                    </h3>
                                    <strong className="text-primary text-nowrap d-block">
                                        {formatMoney(item.total)}
                                    </strong>
                                    <span className="text-muted text-wrap d-block">
                                        {item.items[0] && item.items[0].description}
                                        {item.items.length > 1 &&
                                            " and " + (item.items.length - 1) + " more"}{" "}
                                    </span>
                                    <Link to={`edit/${item.id}`}>
                                        <h6 className="btn btn-primary text-white mt-3"> Modify</h6>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ))}
        </>
    );
}

export { BillList };
