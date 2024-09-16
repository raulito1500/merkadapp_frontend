import React, { useContext } from "react";
import AccordionContext from 'react-bootstrap/AccordionContext';
import { Form, Row, Badge, Accordion, Button, useAccordionButton } from "react-bootstrap";
import { NumberPicker } from "../../../Utils/NumberPicker";
import { useUtilities } from "../../../App/Context/utilities";

function BillItemForm({ item, index, products, errors, onInputChange, onBlur, onRemove }) {

    const utilities = useUtilities();

    const [confirmRemove, setConfirmRemove] = React.useState(false);

    const handleRemove = (index) => {
        setConfirmRemove(false);
        onRemove(index);
    }

    return (
        <Accordion.Item eventKey={index} key={index} className="mb-3 border border-primary-subtle rounded">
            <Row xs={12} className="p-3">
                <Form.Group className="col-5 col-sm-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        value={item.description}
                        onChange={(event) => onInputChange("items", index, "description", event.target.value)}
                    />
                </Form.Group>
                <Form.Group className="col-4 col-sm-2">
                    <Form.Label>Quantity</Form.Label>
                    <NumberPicker
                        value={item.quantity}
                        onChange={(value) => onInputChange("items", index, "quantity", value)}
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
                        onChange={(event) => onInputChange("items", index, "unit_value", event.target.value)}
                        onBlur={() => onBlur("items", index, "unit_value")}
                    />
                </Form.Group>
                <div className="col-4 col-sm-3 pt-2 p-sm-0">
                    <h3 className="mb-0 text-primary">
                        <span className="d-block fw-normal fs-6 text-body">Total </span>
                        <span className="position-relative">${utilities.formatMoney(item.total)}
                            {item.discount ? <Badge className="position-absolute top-0 start-100" bg="success">{(item.discount) * 100}%</Badge> : ""}</span>
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
                            onChange={(event) => onInputChange("items", index, "product_id", event.target.value)}
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
                            onChange={(event) => onInputChange("items", index, "brand", event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="col-6 col-sm-1 pt-2 p-sm-0">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            type="text"
                            value={item.content}
                            onChange={(event) => onInputChange("items", index, "content", event.target.value)}
                            onBlur={() => onBlur("items", index, "content")}
                        />
                    </Form.Group>
                    <Form.Group className="col-6 col-sm-2">
                        <Form.Label>Unit</Form.Label>
                        <Form.Select
                            value={item.unit}
                            onChange={(event) => onInputChange("items", index, "unit", event.target.value)}
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
                            defaultChecked={item.is_additional}
                            onChange={(event) => onInputChange("items", index, "is_additional", event.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="col-6 col-sm-2">
                        <Form.Label>Discount (%)</Form.Label>
                        <Form.Control
                            type="text"
                            value={item.discount}
                            onChange={(event) => onInputChange("items", index, "discount", event.target.value)}
                            onBlur={() => onBlur("items", index, "discount")}
                        />
                    </Form.Group>
                </Row>
            </Accordion.Body>
        </Accordion.Item>
    );
}

function CustomToggle({ className, children, eventKey, callback }) {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = activeEventKey === eventKey;

    return (
        <Button
            variant="link"
            onClick={decoratedOnClick}
            className={className + " " + (isCurrentEventKey ? "opened" : "closed")}
        >
            {children}
        </Button>

    );
}

export default BillItemForm;
