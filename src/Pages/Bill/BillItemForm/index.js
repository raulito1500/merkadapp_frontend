import React from "react";
import { Form, Row, Badge, Accordion, Button } from "react-bootstrap";
import { NumberPicker } from "../../../Utils/NumberPicker";
import { useUtilities } from "../../../App/Context/utilities";
import { CustomToggle } from "../../../Utils/CustomToggle";

function BillItemForm({ item, index, products, errors, onRemove, onChange, onBlur }) {

    const utilities = useUtilities();

    const [confirmRemove, setConfirmRemove] = React.useState(false);

    const handleRemove = (index) => {
        setConfirmRemove(false);
        onRemove(index);
    }

    const handleChange = (field, event) => {
        const inputValue = event.target.value;
        if (["content", "quantity", "unit_value", "discount"].includes(field)) {
            const regex = /^\d*\.?\d*$/;
            if (regex.test(inputValue)) {
                item[field] = inputValue;
            }
            calculateTotalItem();
        }
        else if (["is_additional"].includes(field)) {
            const { checked } = event.target;
            item[field] = checked;
        }
        else {
            item[field] = inputValue;
        }
        onChange(item);
    }

    const handleBlur = (field) => {
        if (["content", "quantity", "unit_value", "discount"].includes(field)) {
            let parsedValue = parseFloat(item[field]);
            if (isNaN(parsedValue) || parsedValue < 0)
                parsedValue = 0;
            item[field] = parsedValue;
            calculateTotalItem();
        }
        onBlur(item)
    }

    const calculateTotalItem = () => {
        let total = 0;
        if (!(isNaN(item.quantity) || isNaN(item.unit_value) || isNaN(item.discount)))
            total = item.quantity * item.unit_value * (1 - item.discount);
        item.total = total;
    }
    return (
        <Accordion.Item
            eventKey={index}
            key={index}
            className={"mb-3 border rounded " + ((!!errors[`items[${index}]`]) ? "border-primary-subtle" : "border-primary-subtle")}
        >
            <Row xs={12} className="p-3">
                <Form.Group className="col-5 col-sm-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        value={item.description}
                        onChange={(event) => handleChange("description", event)}
                    />
                </Form.Group>
                <Form.Group className="col-4 col-sm-2">
                    <Form.Label>Quantity</Form.Label>
                    <NumberPicker
                        initialValue={item.quantity}
                        onChange={(event) => handleChange("quantity", event)}
                        onBlur={() => handleBlur("quantity")}
                        isInvalid={!!errors[`items[${index}].quantity`]}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors[`items[${index}].quantity`]}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-3 col-sm-2">
                    <Form.Label>Unit value</Form.Label>
                    <Form.Control
                        type="text"
                        value={item.unit_value}
                        onChange={(event) => handleChange("unit_value", event)}
                        onBlur={() => handleBlur("unit_value")}
                    />
                </Form.Group>
                <div className="col-4 col-sm-3 pt-2 p-sm-0">
                    <label>Total</label>
                    <h3 className="mb-0 text-primary position-relative">${utilities.formatMoney(item.total)}
                        {item.discount ? <Badge className="position-absolute top-0 start-100 translate-middle" bg="success">{(item.discount) * 100}%</Badge> : ""}
                    </h3>
                </div>
                <div className="col-8 col-sm-2 d-flex justify-content-end p-sm-0">
                    {!confirmRemove ?
                        <Button
                            variant="link"
                            onClick={() => { setConfirmRemove(true) }}
                            className="mx-3 border-0"
                        >
                            <i className="bi bi-trash3"></i>
                        </Button> :
                        <Button
                            variant="link"
                            className="mx-3 border-0"
                            onClick={() => handleRemove(index)}
                            onBlur={() => { setConfirmRemove(false) }}
                        >
                            <i className="bi bi-trash3"></i> Tap again to confirm
                        </Button>
                    }
                    <CustomToggle
                        className="accordionToggle border-0 px-4"
                        eventKey={index}>
                        <i className="bi bi-three-dots-vertical"></i>
                    </CustomToggle>
                </div>

            </Row>
            <Accordion.Body>
                <Row>
                    <Form.Group className="col-6 col-sm-3">
                        <Form.Label>Product</Form.Label>
                        <Form.Select
                            value={item.product_id}
                            onChange={(event) => handleChange("product_id", event)}
                            isInvalid={!!errors[`items[${index}].product_id`]}
                        >
                            <option value=""></option>
                            {products?.map(product => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors[`items[${index}].product_id`]}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="col-6 col-sm-2">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                            value={item.brand}
                            onChange={(event) => handleChange("brand", event)}
                        />
                    </Form.Group>
                    <Form.Group className="col-6 col-sm-1 pt-2 p-sm-0">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            type="text"
                            value={item.content}
                            onChange={(event) => handleChange("content", event)}
                            onBlur={() => handleBlur("content")}
                        />
                    </Form.Group>
                    <Form.Group className="col-6 col-sm-2">
                        <Form.Label>Unit</Form.Label>
                        <Form.Select
                            value={item.unit}
                            onChange={(event) => handleChange("unit", event)}
                        >
                            <option value=""></option>
                            <option value="KG">Kilogramos</option>
                            <option value="ML">Mililitros</option>
                            <option value="UN">Unidad</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="col-6 col-sm-2 pt-2 p-sm-0">
                        <Form.Label>Is additional?</Form.Label>
                        <Form.Control
                            type="checkbox"
                            className="form-check-input flex-shrink-1 ms-2 fs-4"
                            checked={item.is_additional}
                            onChange={(event) => handleChange("is_additional", event)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="col-6 col-sm-2">
                        <Form.Label>Discount (%)</Form.Label>
                        <Form.Control
                            type="text"
                            value={item.discount}
                            onChange={(event) => handleChange("discount", event)}
                        />
                    </Form.Group>
                </Row>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default BillItemForm;
