import React from "react";
import { AppContext } from "../../../App/Context";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Row, Card, Accordion } from "react-bootstrap";
import moment from "moment";
import BillItemForm from "../BillItemForm";
import { BillBag } from "../BillBag";
import { BillTax } from "../BillTax";

function BillEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api, setLoading } = React.useContext(AppContext);

    const [data, setData] = React.useState();
    const [products, setProducts] = React.useState();
    const [errors, setErrors] = React.useState({});

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
                console.log("se presentó un error: " + error);
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
                console.log("se presentó un error")
            })
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (collection, index, field, value) => {
        const updatedItems = [...data[collection]];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setData({ ...data, [collection]: updatedItems });
    };

    const handleBlur = (collection, index, field) => {
        const updatedItems = [...data[collection]];
        let value = updatedItems[index][field];

        if (["unit_value", "quantity", "content", "discount", "value", "total"].includes(field)) {
            value = parseFloat(value);
            if (isNaN(value)) value = "";
        }

        updatedItems[index] = { ...updatedItems[index], [field]: value };

        if (collection === "items" && ["quantity", "unit_value", "discount"].includes(field)) {
            updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unit_value * (1 - updatedItems[index].discount);
        } else if (collection === "bags" && ["quantity", "value"].includes(field)) {
            updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].value;
        }

        const calcData = { ...data, [collection]: updatedItems };
        calcData.total = calculateTotalAmount(calcData);
        setData(calcData);
    };

    const calculateTotalAmount = (calcData) => {
        let sum = 0;
        sum += calcData.items.reduce((acc, item) => acc + item.total, 0);
        sum += calcData.bags.reduce((acc, bag) => acc + bag.total, 0);
        sum += calcData.taxes.reduce((acc, tax) => acc + tax.total, 0);
        return sum;
    };

    const formatoMoney = (number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(number);
    };

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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            setLoading(true);
            delete data.id;
            data.date = new Date(data.date + "T00:00:00").toISOString();
            api.put(`/bills/${id}`, data)
                .then(() => navigate("/bills"))
                .catch(() => console.log("se presentó un error"))
                .finally(() => setLoading(false));
        }
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

    const handleAddTax = () => {
        const newTax = {
            concept: "",
            total: 0
        };

        const updatedTaxes = [...data.taxes, newTax];
        setData({ ...data, taxes: updatedTaxes });
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

    const handleRemoveItem = (index) => {
        const updatedItems = [...data.items];
        updatedItems.splice(index, 1);
        setData({ ...data, items: updatedItems });
    };

    return (
        <>
            {data ? (
                <>
                    <h1>Edit Bill</h1>
                    <Form onSubmit={handleSubmit}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Form.Group className="col-sm-4">
                                        <Form.Label>Where</Form.Label>
                                        <Form.Control
                                            value={data.where}
                                            onChange={(event) => handleFormChange("where", event.target.value)}
                                            isInvalid={!!errors.where}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.where}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="col-sm-3">
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
                                    <Form.Group className="col-sm-2">
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
                                    <Form.Group className="col-sm-3">
                                        <h3 className="mb-0 text-primary"><span className="d-block fw-normal fs-6 text-muted">Total </span>${formatoMoney(data.total)}</h3>
                                    </Form.Group>
                                </Row>
                            </Card.Body>
                        </Card>

                        <h2>Items <Button variant="outline-primary" size="sm" onClick={handleAddItem}>Add item</Button></h2>
                        <Accordion defaultActiveKey="0">
                            {data.items.map((item, index) => (
                                <BillItemForm
                                    key={index}
                                    item={item}
                                    index={index}
                                    products={products}
                                    errors={errors}
                                    onInputChange={handleInputChange}
                                    onBlur={handleBlur}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </Accordion>

                        <h2>Taxes<Button variant="outline-primary" size="sm" onClick={handleAddTax}>Add tax</Button></h2>
                        <Accordion defaultActiveKey="0">
                            {data.taxes.map((tax, index) => (
                                <BillTax
                                    key={index}
                                    tax={tax}
                                    index={index}
                                    onInputChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                            ))}
                        </Accordion>

                        <h2>Bags<Button variant="outline-primary" size="sm" onClick={handleAddBag}>Add bag</Button></h2>
                        <Accordion defaultActiveKey="0">
                            {data.bags.map((bag, index) => (
                                <BillBag
                                    key={index}
                                    bag={bag}
                                    index={index}
                                    onInputChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                            ))}
                        </Accordion>

                        <Button className="ms-auto mt-2 mb-4 text-light" type="submit">
                            Save
                        </Button>
                    </Form>
                </>
            ) : (
                ""
            )}
        </>
    );
}

export { BillEdit };
