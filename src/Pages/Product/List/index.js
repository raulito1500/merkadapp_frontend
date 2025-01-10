import React from "react";
import { AppContext } from "../../../App/Context/app";
import { Badge, Button, ButtonGroup, Card, Dropdown, Form, InputGroup, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProductList() {
    const { api, setLoading, pushNotifications } = React.useContext(AppContext);
    const [listGrouped, setListGrouped] = React.useState([]);

    const groupProductByCategory = (products) => {
        return products.reduce((grouped, product) => {
            if (!grouped[product.category]) {
                grouped[product.category] = [];
            }
            grouped[product.category].push(product);
            return grouped;
        }, {});
    };

    React.useEffect(() => {
        setLoading(true);
        api.get(`/products/true`)
            .then((response) => {
                const data = groupProductByCategory(response.data);
                setListGrouped(data);
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);
    return (
        <>
            <h1>
                <Link
                    to="/">
                    <i className="bi bi-arrow-left fs-5"></i>
                </Link> Product list</h1>
            <Card>
                <Card.Title><i className="bi bi-stars"></i> Recommendations</Card.Title>
                <Card.Body>
                    
                    <InputGroup>
                        <InputGroup.Text className="position-relative">
                            Electrolit
                            <Badge className="position-absolute top-0 start-0 translate-middle" bg="primary">4</Badge>
                        </InputGroup.Text>
                        <Link className="btn btn-outline-primary"><i className="bi bi-check-lg"></i></Link>
                        <Link className="btn btn-outline-primary"><i class="bi bi-x-lg"></i></Link>
                    </InputGroup><InputGroup>
                        <InputGroup.Text className="position-relative">
                            Kiwi
                            <Badge className="position-absolute top-0 start-0 translate-middle" bg="primary">4</Badge>
                        </InputGroup.Text>
                        <Link className="btn btn-outline-primary"><i className="bi bi-check-lg"></i></Link>
                        <Link className="btn btn-outline-primary"><i class="bi bi-x-lg"></i></Link>
                    </InputGroup><InputGroup>
                        <InputGroup.Text className="position-relative">
                            Tocino ahumado
                            <Badge className="position-absolute top-0 start-0 translate-middle" bg="primary">3</Badge>
                        </InputGroup.Text>
                        <Link className="btn btn-outline-primary"><i className="bi bi-check-lg"></i></Link>
                        <Link className="btn btn-outline-primary"><i class="bi bi-x-lg"></i></Link>
                    </InputGroup><InputGroup>
                        <InputGroup.Text className="position-relative">
                            Jugo de naranja
                            <Badge className="position-absolute top-0 start-0 translate-middle" bg="primary">3</Badge>
                        </InputGroup.Text>
                        <Link className="btn btn-outline-primary"><i className="bi bi-check-lg"></i></Link>
                        <Link className="btn btn-outline-primary"><i class="bi bi-x-lg"></i></Link>
                    </InputGroup>
                </Card.Body>
            </Card>
            <Card className="my-3">
                <Card.Body className="py-2">
                    <InputGroup>
                        <InputGroup.Text className="border-0 bg-transparent"><i className="bi bi-search"></i></InputGroup.Text>
                        <Form.Control
                            className="border-0"
                            placeholder="Apple, Oil, Soap" />
                        <Button
                            className="text-secondary"
                            variant="link">
                            <i className="bi bi-sort-down"></i>
                        </Button>
                        <Dropdown>
                            <Dropdown.Toggle
                                bsPrefix="text-secondary"
                                variant="link">
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
            {Object.keys(listGrouped).map((category, index) => (
                <Row className="px-2">
                    <h2>{category}</h2>
                    <ListGroup className="px-2">
                        {listGrouped[category].map((item, index) => (
                            <ListGroup.Item
                                as="label"
                                key={item.id}
                                className="d-flex flex-column gap-3 align-items-start">
                                <h5>{item.name}</h5>
                                <span>Each {item.repeat}</span>
                                <span>Last purchase at <strong>Euro supermercado</strong> for <strong className="text-primary">$41.990</strong>, one month ago </span>
                                <span><i className="bi bi-graph-up-arrow text-primary"></i> Upward trend of <strong className="text-primary">15%</strong></span>
                                <Link className="btn btn-primary text-white">Modify</Link>
                                <ButtonGroup>
                                    <Link className="btn btn-outline-primary"><i className="bi bi-list"></i></Link>
                                    <Link className="btn btn-outline-primary"><i className="bi bi-pencil-square"></i></Link>
                                </ButtonGroup>
                            </ListGroup.Item>
                        ))
                        }
                    </ListGroup>
                </Row>
            ))}
        </>
    )
}

export { ProductList }