import React from "react";
import { AppContext } from "../../../App/Context";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Row, Card, Accordion, Badge } from "react-bootstrap";
import moment from "moment";

function BillEdit() {
    const { id } = useParams();

    const navigate = useNavigate();

    const {
        api,
        setLoading
    } = React.useContext(AppContext);

    const [data, setData] = React.useState();
    const [products, setProducts] = React.useState();
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        setLoading(true);
        api
            .get(`/bills/${id}`)
            .then((response) => {
                const data = response.data;
                data.date = moment(response.data.date).format('YYYY-MM-DD')
                setData(data);
            })
            .catch(error => {
                console.log("se presentó un error: " + error);
            })
            .finally(() => setLoading(false));
    }, []);

    React.useEffect(() => {
        setLoading(true);
        api
            .get(`/products`)
            .then((response) => {
                setProducts(response.data);
            })
            .catch(error => {
                console.log("se presentó un error")
            })
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...data.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setData({ ...data, items: updatedItems });
    };

    const handleBlur = (index, field) => {
        const updatedItems = [...data.items];

        // Convertir a número cuando el usuario termina de editar (onBlur)
        let value = updatedItems[index][field];
        if (field === "unit_value") {
            value = parseInt(value, 10);
            if (isNaN(value)) {
                value = ""; // Puedes manejar de otra manera si es necesario
            }
        }
        if (field === "quantity" || field === "content" || field === "discount") {
            value = parseFloat(value);
            if (isNaN(value)) {
                value = ""; // Puedes manejar de otra manera si es necesario
            }
        }
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        if (field === "quantity" || field === "unit_value" || field === "discount"){
            updatedItems[index].total = updatedItems[index]["quantity"] * updatedItems[index]["unit_value"] * (1 - updatedItems[index]["discount"]);
        }
        setData({ ...data, items: updatedItems });
    };

    const handleFormChange = (field, value) => {
        setData({ ...data, [field]: value });
    };

    const validate = () => {
        const newErrors = {};

        if (!data.where) {
            newErrors.where = "Where is required";
        }

        data.items.forEach((item, index) => {
            /* if (!item.product_id) {
                newErrors[`items[${index}].product_id`] = "Product ID is required";
            } */
            if (item.quantity <= 0) {
                newErrors[`items[${index}].quantity`] = "Quantity must be greater than 0";
            }
            // Agrega más validaciones según sea necesario
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            setLoading(true);
            // normalizar info
            delete data.id;
            data.date = new Date(data.date + "T00:00:00").toISOString();
            api
                .put(`/bills/${id}`, data)
                .then((response) => {
                    navigate("/bills");
                })
                .catch(error => {
                    console.log("se presentó un error")
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <>{data ? <>
            <h1>Edit Bill</h1>
            <Form onSubmit={handleSubmit}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Form.Group className="col-sm-4">
                                <Form.Label>Where</Form.Label>
                                <Form.Control value={data.where}
                                    onChange={(event) => handleFormChange("where", event.target.value)}
                                    isInvalid={!!errors.where} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.where}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="col-sm-4">
                                <Form.Label>Paid by</Form.Label>
                                <Form.Select
                                    value={data.paid_by}
                                    onChange={(event) => handleFormChange("paid_by", event.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="RAUL">Raúl</option>
                                    <option value="MANUEL">Manuel</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="col-sm-4">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={data.date}
                                    onChange={(event) => handleFormChange("date", event.target.value)}
                                    isInvalid={!!errors.date} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.date}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                    </Card.Body>
                </Card>
                <h2>Items</h2>
                <Accordion defaultActiveKey="0">
                    {data.items.map((item, index) => (
                        <Accordion.Item eventKey={index} key={index} className="mb-3 border border-primary-subtle rounded">
                            <Accordion.Header>
                                <Form.Group className="col-sm-2">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                        value={item.quantity}
                                        onChange={(event) => handleInputChange(index, "quantity", event.target.value)}
                                        onBlur={() => handleBlur(index, "quantity")}
                                        isInvalid={!!errors[`items[${index}].quantity`]}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors[`items[${index}].quantity`]}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="col-sm-5">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        value={item.description}
                                        onChange={(event) => handleInputChange(index, "description", event.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="col-sm-2">
                                    <Form.Label>Unit value</Form.Label>
                                    <Form.Control
                                        value={item.unit_value}
                                        onChange={(event) => handleInputChange(index, "unit_value", event.target.value)}
                                        onBlur={() => handleBlur(index, "unit_value")}
                                    />
                                </Form.Group>
                                <Form.Group className="col-sm-2">
                                    <Form.Label>Total{item.discount ? <sup><Badge bg="success">{item.discount}%</Badge></sup> : ""}</Form.Label>
                                    <Form.Control
                                        value={item.total}
                                        disabled
                                        readOnly
                                    />
                                </Form.Group>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Form.Group className="col-sm-4">
                                        <Form.Label>Product</Form.Label>
                                        <Form.Control
                                            value={item.product_id}
                                            onChange={(event) => handleInputChange(index, "product_id", event.target.value)}
                                            isInvalid={!!errors[`items[${index}].product_id`]}
                                        />
                                        <Form.Select>
                                            <option value=""></option>
                                            {products ? products.map((item, product) => (
                                                <option value={product.id}>{product.name}</option>
                                            )) : <></>}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors[`items[${index}].product_id`]}
                                        </Form.Control.Feedback>
                                    </Form.Group><Form.Group className="col-sm-4">
                                        <Form.Label>Brand</Form.Label>
                                        <Form.Control
                                            value={item.brand}
                                            onChange={(event) => handleInputChange(index, "brand", event.target.value)}
                                        />
                                    </Form.Group><Form.Group className="col-sm-4">
                                        <Form.Label>Content</Form.Label>
                                        <Form.Control
                                            value={item.content}
                                            onChange={(event) => handleInputChange(index, "content", event.target.value)}
                                            onBlur={() => handleBlur(index, "content")}
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-sm-4">
                                        <Form.Label>Unit</Form.Label>
                                        <Form.Select
                                            value={item.unit}
                                            onChange={(event) => handleInputChange(index, "unit", event.target.value)}
                                        >
                                            <option value=""></option>
                                            <option value="KG">Kilogramos</option>
                                            <option value="ML">Mililitros</option>
                                            <option value="UN">Unidad</option>
                                        </Form.Select>
                                    </Form.Group><Form.Group className="col-sm-4">
                                        <Form.Label>Additional</Form.Label>
                                        <Form.Control
                                            value={item.is_additional}
                                            onChange={(event) => handleInputChange(index, "is_additional", event.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="col-sm-4">
                                        <Form.Label>Discount (%)</Form.Label>
                                        <Form.Control
                                            value={item.discount}
                                            onChange={(event) => handleInputChange(index, "discount", event.target.value)}
                                            onBlur={() => handleBlur(index, "discount")}
                                        />
                                    </Form.Group>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>

                <h2>Taxes</h2>
                <h2>Bags</h2>
                <Button
                    className="ms-auto mt-2 mb-4 text-light"
                    type="submit"
                > Save
                </Button>
            </Form>
        </> : ""}</>
    )
}

export { BillEdit }