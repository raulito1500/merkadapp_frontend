import React from "react";
import { Form, Row, Badge, Accordion, Button } from "react-bootstrap";

function BillItemForm({ item, index, products, errors, onInputChange, onBlur, onRemove }) {
    return (
        <Accordion.Item eventKey={index} key={index} className="mb-3 border border-primary-subtle rounded">
            <Accordion.Header>
                <Form.Group className="col-sm-2">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        value={item.quantity}
                        onChange={(event) => onInputChange("items", index, "quantity", event.target.value)}
                        onBlur={() => onBlur("items", index,  "quantity")}
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
                        onChange={(event) => onInputChange("items", index, "description", event.target.value)}
                    />
                </Form.Group>
                <Form.Group className="col-sm-2">
                    <Form.Label>Unit value</Form.Label>
                    <Form.Control
                        value={item.unit_value}
                        onChange={(event) => onInputChange("items", index, "unit_value", event.target.value)}
                        onBlur={() => onBlur("items", index,  "unit_value")}
                    />
                </Form.Group>
                <Form.Group className="col-sm-2">
                    <Form.Label>Total {item.discount ? <sup><Badge bg="success">{(item.discount) * 100}%</Badge></sup> : ""}</Form.Label>
                    <Form.Control
                        value={item.total}
                        disabled
                        readOnly
                    />
                </Form.Group>
                <Button
                    variant="link"
                    onClick={() => onRemove(index)}>
                    <i className="bi bi-trash3"></i>
                </Button>
            </Accordion.Header>
            <Accordion.Body>
                <Row>
                    <Form.Group className="col-sm-4">
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
                    <Form.Group className="col-sm-4">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                            value={item.brand}
                            onChange={(event) => onInputChange("items", index, "brand", event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="col-sm-4">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            value={item.content}
                            onChange={(event) => onInputChange("items", index, "content", event.target.value)}
                            onBlur={() => onBlur("items", index,  "content")}
                        />
                    </Form.Group>
                    <Form.Group className="col-sm-4">
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
                    <Form.Group className="col-sm-4">
                        <Form.Label>Additional</Form.Label>
                        <Form.Control
                            value={item.is_additional}
                            onChange={(event) => onInputChange("items", index, "is_additional", event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="col-sm-4">
                        <Form.Label>Discount (%)</Form.Label>
                        <Form.Control
                            value={item.discount}
                            onChange={(event) => onInputChange("items", index, "discount", event.target.value)}
                            onBlur={() => onBlur("items", index,  "discount")}
                        />
                    </Form.Group>
                </Row>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default BillItemForm;
