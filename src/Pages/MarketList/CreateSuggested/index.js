import React from "react";
import { AppContext } from "../../../App/Context/app";
import { Button, Form, ListGroup } from "react-bootstrap";
import moment from "moment";
import { NumberPicker } from "../../../Utils/NumberPicker";

function MarketListCreateSuggested({ loadMarketList }) {
    const {
        api,
        setLoading,
        setShow
    } = React.useContext(AppContext);

    const [date, setDate] = React.useState();
    const [suggested, setSuggested] = React.useState([]);
    const [others, setOthers] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        api
            .get(`/market-list/suggested`)
            .then((response) => {
                setDate(moment(response.data.date).format('YYYY-MM-DD'));
                setSuggested(response.data.items.filter((d) => d.checked === true));
                setOthers(response.data.items.filter((d) => d.checked === false));
            })
            .catch(error => {
                console.log("se presentó un error: " + error);
            })
            .finally(() => setLoading(false));
    }, []);

    const addItem = (product_id) => {
        const index = others.findIndex((item) => item.product_id === product_id);
        if (index >= 0) {
            const element = others[index];
            if (element.quantity > 0) {
                element.checked = true;
                setSuggested([...suggested, element]);
                setOthers([...others.slice(0, index), ...others.slice(index + 1)]);
            }
        }
    }
    const removeItem = (product_id) => {
        const index = suggested.findIndex((item) => item.product_id === product_id);
        if (index >= 0) {
            const element = suggested[index];
            element.checked = false;
            setOthers([...others, element]);
            setSuggested([...suggested.slice(0, index), ...suggested.slice(index + 1)]);
        }
    }
    const saveMarketList = () => {
        const list = {
            date: new Date(date + "T00:00:00").toISOString(),
            items: suggested.map(item => ({ ...item, checked: false }))
        };
        setLoading(true);
        api
            .post(`/market-list`, list)
            .then((response) => {
            })
            .catch(error => {
                console.log("se presentó un error")
            })
            .finally(() => {
                loadMarketList();
                setLoading(false);
                setShow(false);
            });
    }

    const onInputChange = (productId, value) => {
        const newOthers = [...others];
        const index = newOthers.findIndex((item) => item.product_id === productId);
        newOthers[index].quantity = value;
        setOthers(newOthers);
    }
    return (
        <>{date ?
            <div className="d-flex flex-column">
                <p>
                    <strong>Fecha:</strong>
                    <Form.Control
                        value={date}
                        onChange={(event) => { setDate(event.target.value) }}
                        type="date" />
                </p>
                <h5>Suggested</h5>
                <ListGroup>
                    {suggested.map((item, index) => (
                        <ListGroup.Item
                            as="label"
                            key={item.product_id}
                            className="list-group-item d-flex gap-3">
                            <span className="opacity-50 text-nowrap pt-1 flex-shrink-1">{item.quantity}</span>
                            <span className="pt-1 form-checked-content flex-grow-1">
                                {item.product_name}
                            </span>
                            <input
                                className="form-check-input flex-shrink-1"
                                type="checkbox"
                                defaultChecked={item.checked}
                                onChange={(event) => removeItem(item.product_id)}
                                style={{ fontSize: "1.375em" }} />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Button
                    className="ms-auto mt-2 mb-4 text-light"
                    onClick={() => saveMarketList()}
                > Create list
                </Button>
                <h5>Others</h5>
                <ListGroup>
                    {others.map((item, index) => (
                        <ListGroup.Item
                            as="label"
                            key={item.product_id}
                            className="list-group-item d-flex justify-content-between gap-3">
                            <NumberPicker
                                value={item.quantity}
                                onChange={(value) => onInputChange(item.product_id, value)}
                            />
                            <span className="pt-1 w-100 bd-highlight form-checked-content">
                                {item.product_name}
                            </span>
                            <Button
                                variant="link"
                                onClick={() => addItem(item.product_id)}>
                                <i className="bi bi-cart-plus"></i>
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup></div > : ""}</>
    )
}

export { MarketListCreateSuggested }