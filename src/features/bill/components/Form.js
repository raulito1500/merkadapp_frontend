import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Form, Row, Card, Accordion, Container } from "react-bootstrap";
import BillItemForm from "./ItemForm";
import { BillBag } from "./Bag";
import { BillTax } from "./Tax";
import { formatMoney } from "../../../shared/utils/formatting";
import { useBillForm } from "../hooks/useBillForm";

function BillForm() {
    const { id } = useParams();
    const {
        data,
        products,
        errors,
        handleFormChange,
        handleChange,
        handleBlur,
        handleAddItem,
        handleAddBag,
        handleAddTax,
        handleRemoveItem,
        handleSubmit,
    } = useBillForm(id);

    if (!data) {
        return "";
    }

    return (
        <>
            <h1>
                <Link to="/bills">
                    <i className="bi bi-arrow-left fs-5"></i>
                </Link>{" "}
                {id ? "Edit bill" : "Create bill"}
            </h1>
            <Form onSubmit={handleSubmit}>
                <Container fluid className="fixed-bottom px-3 pt-2 pb-4 bg-white d-flex justify-content-between shadow-lg z-2">
                    <h3 className="mb-0 text-primary"><span className="d-block fw-normal fs-6 text-muted">Total </span>{formatMoney(data.total)}</h3>
                    <Button
                        className="align-self-end text-light"
                        type="submit"
                    >
                        {id ? "Update bill" : "Create bill"}
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
    );
}

export { BillForm };
