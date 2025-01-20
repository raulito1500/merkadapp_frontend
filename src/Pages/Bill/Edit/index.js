import React from "react";
import { AppContext } from "../../../App/Context/app";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Form, Row, Card, Accordion, Container } from "react-bootstrap";
import moment from "moment";
import BillItemForm from "../BillItemForm";
import { BillBag } from "../BillBag";
import { BillTax } from "../BillTax";
import { formatMoney } from "../../../utils/formatting";

function BillEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api, setLoading, pushNotifications } = React.useContext(AppContext);

    const [data, setData] = React.useState();
    const [products, setProducts] = React.useState();
    const [errors, setErrors] = React.useState({});

    const handleFormChange = (field, value) => {
        setData({ ...data, [field]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!data.where) newErrors.where = "Where is required";

        data.items.forEach((item, index) => {
            if (item.quantity <= 0) newErrors[`items[${index}].quantity`] = "Quantity must be greater than 0";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    React.useEffect(() => {
        setLoading(true);
        api.get(`/bills/${id}`)
            .then((response) => {
                const data = response.data;
                data.date = moment(response.data.date).format('YYYY-MM-DD');
                if (!data.taxes) {
                    data.taxes = [];
                }
                if (!data.bags) {
                    data.bags = [];
                }
                if (!data.items) {
                    data.items = [];
                }
                setData(data);
            })
            .catch(error => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, [id]);

    React.useEffect(() => {
        setLoading(true);
        api.get(`/products/true`)
            .then((response) => {
                setProducts(response.data);
            })
            .catch(error => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);

    const calculateTotalAmount = (calcData) => {
        let sum = 0;
        sum += calcData.items.reduce((acc, item) => acc + item.total, 0);
        sum += calcData.bags.reduce((acc, bag) => acc + bag.total, 0);
        sum += calcData.taxes.reduce((acc, tax) => acc + tax.total, 0);
        return sum;
    };

    const handleChange = (collection, index, item) => {
        const updatedItems = [...data[collection]];
        updatedItems[index] = item;

        const calcData = { ...data, [collection]: updatedItems };
        calcData.total = calculateTotalAmount(calcData);

        setData(calcData);
    }

    const handleBlur = (collection, index, item) => {
        const updatedItems = [...data[collection]];
        updatedItems[index] = item;
        setData({ ...data, [collection]: updatedItems });
    };

    const handleAddItem = () => {
        const newItem = {
            product_id: "",
            quantity: 0,
            description: "",
            brand: "",
            content: "",
            unit: "",
            is_additional: false,
            unit_value: 0,
            discount: 0,
            total: 0
        };

        const updatedItems = [...data.items, newItem];
        setData({ ...data, items: updatedItems });
    }

    const handleAddBag = () => {
        const newBag = {
            quantity: 0,
            value: 0,
            total: 0
        };
        const updatedBags = [...data.bags, newBag];
        setData({ ...data, bags: updatedBags });
    }

    const handleAddTax = () => {
        const newTax = {
            concept: "",
            total: 0
        };
        const updatedTaxes = [...data.taxes, newTax];
        setData({ ...data, taxes: updatedTaxes });
    }
    const handleRemoveItem = (index) => {
        const updatedItems = [...data.items];
        updatedItems.splice(index, 1);
        setData({ ...data, items: updatedItems });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            setLoading(true);
            const bill = {
                ...data,
                date: new Date(data.date + "T00:00:00").toISOString()
            }
            delete bill.id;
            api.put(`/bills/${id}`, bill)
                .then(() => navigate("/bills"))
                .catch((error) => {
                    pushNotifications("¡Ups! We have an error", error, "error");
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <>
            {data ? (
                <>
                    <h1>
                        <Link
                            to="/bills">
                            <i className="bi bi-arrow-left fs-5"></i>
                        </Link> Edit bill</h1>
                    <Form onSubmit={handleSubmit}>
                        <Container fluid className="fixed-bottom px-3 pt-2 pb-4 bg-white d-flex justify-content-between shadow-lg">
                            <h3 className="mb-0 text-primary"><span className="d-block fw-normal fs-6 text-muted">Total </span>{formatMoney(data.total)}</h3>
                            <Button
                                className="align-self-end text-light"
                                type="submit"
                            >
                                Update bill
                            </Button>
                        </Container>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Form.Group className="col-12 col-sm-6 mb-2">
                                        <Form.Label>Purchase at</Form.Label>
                                        <Form.Control
                                            value={data.where}
                                            onChange={(event) => handleFormChange("where", event.target.value)}
                                            isInvalid={!!errors.where}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.where}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="col-6 col-sm-3">
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
                                    <Form.Group className="col-6 col-sm-3">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={data.date}
                                            onChange={(event) => handleFormChange("date", event.target.value)}
                                            isInvalid={!!errors.date}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.date}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                            </Card.Body>
                        </Card>
                        <h2 className="mt-3 d-flex justify-content-between">
                            Items
                            <Button
                                className="align-self-end"
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleAddItem}
                            >
                                <i className="bi bi-plus"></i>
                                Add item
                            </Button>
                        </h2>
                        <Accordion defaultActiveKey="0">
                            {data.items.map((item, index) => (
                                <BillItemForm
                                    key={index}
                                    item={item}
                                    index={index}
                                    products={products}
                                    errors={errors}
                                    onRemove={handleRemoveItem}
                                    onChange={(item) => handleChange("items", index, item)}
                                    onBlur={(item) => handleBlur("items", index, item)}
                                />
                            ))}
                        </Accordion>
                        <h2 className="mt-3 d-flex justify-content-between">
                            Taxes
                            <Button
                                className="align-self-end"
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleAddTax}
                            >
                                <i className="bi bi-plus"></i>
                                Add tax
                            </Button>
                        </h2>
                        <Accordion defaultActiveKey="0">
                            {data.taxes.map((tax, index) => (
                                <BillTax
                                    key={index}
                                    tax={tax}
                                    index={index}
                                    onChange={(item) => handleChange("taxes", index, item)}
                                    onBlur={(item) => handleBlur("taxes", index, item)}
                                />
                            ))}
                        </Accordion>
                        <h2 className="mt-3 d-flex justify-content-between">
                            Bags
                            <Button
                                className="align-self-end"
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleAddBag}
                            >
                                <i className="bi bi-plus"></i>
                                Add bag
                            </Button>
                        </h2>
                        <Accordion defaultActiveKey="0">
                            {data.bags.map((bag, index) => (
                                <BillBag
                                    key={index}
                                    bag={bag}
                                    index={index}
                                    errors={errors}
                                    onChange={(item) => handleChange("bags", index, item)}
                                    onBlur={(item) => handleBlur("bags", index, item)}
                                />
                            ))}
                        </Accordion>
                    </Form>
                </>
            ) : (
                ""
            )}
        </>
    );
}

export { BillEdit };
