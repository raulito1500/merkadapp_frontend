import React from "react";
import { AppContext } from "../../../App/Context/app";
import { Button, Form, ListGroup } from "react-bootstrap";
import moment from "moment";
import { NumberPicker } from "../../../Utils/NumberPicker";

function MarketListCreateSuggested({ loadMarketList }) {
    const {
        api,
        setLoading,
        setShow,
        setNotifications
    } = React.useContext(AppContext);

    const [data, setData] = React.useState([]);
    const [date, setDate] = React.useState("");

    const nextMarketDay = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysToSaturday = 6 - dayOfWeek;
        const nextSaturday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + daysToSaturday,
            0, 0, 0, 0
        );
        return moment(nextSaturday).format('YYYY-MM-DD');
    }

    React.useEffect(() => {
        setLoading(true);
        api
            .get(`/market-list/suggested`)
            .then((response) => {
                const data = response.data;
                setDate(nextMarketDay());
                setData(data);
            })
            .catch(error => {
                console.log("se presentó un error: " + error);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAddItem = () => {
        const newItem = {
            product_id: "",
            product_name: "",
            quantity: 0,
            checked: true,
            category: "UNCATEGORIZED",
        }
        const updateItems = [newItem, ...data.items];
        setData({ ...data, items: updateItems });
        setNotifications([{ content: "Se ha creado un nuevo item" }])
    }

    const handleItemChange = (index, field, event) => {
        const value = event.target.value;
        const newData = [...data.items];
        if (field !== "checked")
            newData[index][field] = value;
        else
            newData[index][field] = event.target.checked;
        setData({ ...data, items: newData });

    }

    const saveMarketList = () => {
        const list = {
            date: new Date(date + "T00:00:00").toISOString(),
            items: data.items.filter((d) => d.checked === true).map(item => ({ ...item, checked: false }))
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
    return (
        <>
            {data.items ?
                <div className="d-flex flex-column">
                    <p>
                        <strong>Fecha:</strong>
                        <Form.Control
                            value={date}
                            onChange={(event) => { setDate(event.target.value) }}
                            type="date" />
                    </p>
                    <h2 className="mt-3 d-flex justify-content-between">
                        Items
                        <Button
                            className="align-self-end"
                            variant="outline-primary"
                            size="sm"
                            onClick={handleAddItem}
                        >
                            Add item
                        </Button>
                    </h2>
                    <ListGroup>
                        {data.items.map((item, index) => (
                            <ListGroup.Item
                                as="label"
                                key={index + item.product_id}
                                className="list-group-item d-flex align-items-center">
                                <NumberPicker
                                    className="w-25 me-2"
                                    initialValue={item.quantity}
                                    onChange={(event) => handleItemChange(index, "quantity", event)}
                                />
                                <span className="pt-1 form-checked-content flex-grow-1 pe-2">
                                    {item.product_id !== "" ?
                                        item.product_name
                                        :
                                        <Form.Control
                                            className=""
                                            onChange={(event) => handleItemChange(index, "product_name", event)}
                                            value={item.product_name}
                                        />
                                    }
                                </span>
                                <input
                                    className="form-check-input fs-4"
                                    type="checkbox"
                                    defaultChecked={item.checked}
                                    onChange={(event) => handleItemChange(index, "checked", event)}
                                />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Button
                        className="ms-auto mt-2 mb-4 text-light"
                        onClick={() => saveMarketList()}
                    > Create list
                    </Button>
                </div > : ""}</>
    )
}

export { MarketListCreateSuggested }