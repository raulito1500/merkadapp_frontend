import React from "react";
import { Form } from "react-bootstrap";

function BillCreate() {
    return (
        <><h1>Create Bill</h1>
            <Form>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="floatingInputCustom"
                        type="text"
                        placeholder="name@example.com"
                    />
                    <label htmlFor="floatingInputCustom">Where</label>
                </Form.Floating>

                <Form.Group>
                    <Form.Label>Paid by</Form.Label>
                    <Form.Select>
                        <option value="RAUL">Raúl</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control></Form.Control>
                </Form.Group>
                <h2>Items</h2>
                <h2>Taxes</h2>
                <h2>Bags</h2>
            </Form>
        </>
    )
}

export { BillCreate }