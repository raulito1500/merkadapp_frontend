import React from "react";
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../../../App/Context";
import { Button, ListGroup } from "react-bootstrap";
import moment from "moment";

function MarketListCreateSuggested() {
    const {
        setLoading,
        setShow
    } = React.useContext(AppContext);

    const [date, setDate] = React.useState();
    const [suggested, setSuggested] = React.useState([]);
    const [others, setOthers] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // const server = "https://merkadapp-ed7aeb2134b5.herokuapp.com";
                const server = "http://localhost:8080";
                const response = await fetch(`${server}/market-list/suggested`);
                if (response.ok) {
                    const data = await response.json();
                    setDate(data.date);
                    setSuggested(data.items.filter((d) => d.checked === true));
                    setOthers(data.items.filter((d) => d.checked === false));
                } else {
                    throw new Error('Error al obtener los datos del servicio');
                }
            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const addItem = (product_id) => {
        const index = others.findIndex((item) => item.product_id === product_id);
        if (index >= 0) {
            const newOthers = [...others];
            
            const element = newOthers.at(index);
            element.checked = true;
            const newSuggested = [...suggested];
            newSuggested.push(element);
            setSuggested(newSuggested);

            newOthers.splice(index, 1);
            setOthers(newOthers);
        }
    }
    const saveMarketList = () => {
        const dataToSend = {
            date: date,
            items: suggested.map(item => ({...item, checked: false}))
        };
        const fetchData = async () => {
            setLoading(true);
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                };
                // const server = "https://merkadapp-ed7aeb2134b5.herokuapp.com";
                const server = "http://localhost:8080";
                const response = await fetch(`${server}/market-list`, requestOptions);
                if (response.ok) {
                } else {
                    throw new Error('Error al obtener los datos del servicio');
                }
            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(false);
            setShow(false);

        };

        fetchData();
    }
    return (
        <>{date ?
            <>
                <p>
                    <strong>Fecha:</strong> {moment(date).format('MMM Do')}
                </p>
                <h3>Suggested</h3>
                <ListGroup>
                    {suggested.map((item, index) => (
                        <ListGroup.Item
                            as="label"
                            key={index}
                            className="list-group-item d-flex gap-3">
                            <span className="opacity-50 text-nowrap pt-1 flex-shrink-1">{item.quantity}</span>
                            <span className="pt-1 form-checked-content flex-grow-1">
                                {item.product_name}
                            </span>
                            <input
                                className="form-check-input flex-shrink-1"
                                type="checkbox"
                                defaultChecked={item.checked}
                                onChange={(event) => addItem(event, item.product_id)}
                                style={{ fontSize: "1.375em" }} />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Button
                    onClick={() => saveMarketList()}
                >
                    Save
                </Button>
                <h3>Others</h3>
                <ListGroup>
                    {others.map((item, index) => (
                        <ListGroup.Item
                            as="label"
                            key={index}
                            className="list-group-item d-flex gap-3">
                            <span className="opacity-50 text-nowrap pt-1 flex-shrink-1">{item.quantity}</span>
                            <span className="pt-1 form-checked-content flex-grow-1">
                                {item.product_name}
                            </span>
                            <a
                                onClick={() => addItem(item.product_id)}>
                                <i className="bi bi-plus-circle"></i>
                            </a>
                        </ListGroup.Item>
                    ))}
                </ListGroup></> : ""}</>
    )
}

export { MarketListCreateSuggested }