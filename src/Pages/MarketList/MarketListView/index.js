import React from "react";
import { ListGroup, ProgressBar } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../App/Context";
import moment from "moment";

function MarketListView() {
    const { id } = useParams();

    const [list, setList] = React.useState();
    const {
        setLoading
    } = React.useContext(AppContext);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // const server = "https://merkadapp-ed7aeb2134b5.herokuapp.com";
                const server = "http://localhost:8080";
                const response = await fetch(`${server}/market-list/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    data.completedItems = data.items.filter(item => !!item.checked).length;
                    data.totalItems = data.items.length;
                    data.completedStatus = (data.completedItems / data.totalItems) * 100;
                    setList(data);
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

    const checkItem = (event, idItem) => {
        const index = list.items.findIndex((item) => item.id === idItem);

        const fetchData = async () => {
            setLoading(true);
            event.target.disabled = true;
            try {
                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify()
                };
                const server = "https://merkadapp-ed7aeb2134b5.herokuapp.com";
                // const server = "http://localhost:8080";
                const response = await fetch(`${server}/market-list/${list.id}/check/${list.items[index].id}`, requestOptions);
                if (response.ok) {
                    list.items[index].checked = true;
                    setList(list);
                } else {
                    throw new Error('Error al obtener los datos del servicio');
                }
            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(false);
        };

        fetchData();
    }
    return (
        <>{list ?
            <><h1>Market List</h1>
                <p className="fs-5 col-md-8">
                    <strong>Fecha:</strong> {moment(list.date).format('MMM Do')}
                </p>
                <ProgressBar className="w-100 mb-2" now={list.completedStatus} label={`${list.completedItems} of ${list.totalItems}`} />
                <ListGroup>
                    {list.items.map((item, index) => (
                        <ListGroup.Item
                            as="label"
                            key={index}
                            className="list-group-item d-flex gap-3">
                            <span className="opacity-50 text-nowrap pt-1 flex-shrink-1">{item.quantity}</span>
                            <span className="pt-1 form-checked-content flex-grow-1">
                                <strong>{item.product_name}</strong>
                                <div className="d-flex justify-content-start">
                                    <small className="me-3 text-body-secondary">
                                        <i className="me-1 bi bi-crosshair"></i>
                                        Mayorista
                                    </small>
                                    <small className="me-3 text-body-secondary">
                                        <i className="me-1 bi bi-cash"></i>
                                        $10,000
                                    </small>
                                    <small className="me-3 text-body-secondary">
                                        <i className="me-1 bi bi-calendar-event"></i>
                                        2024/04/30
                                    </small>
                                </div>
                            </span>
                            <input
                                className="form-check-input flex-shrink-1"
                                type="checkbox"
                                disabled={item.checked}
                                defaultChecked={item.checked}
                                onChange={(event) => checkItem(event, item.id)}
                                style={{ fontSize: "1.375em" }} />
                        </ListGroup.Item>
                    ))}
                </ListGroup></> : ""}</>
    )
}

export { MarketListView }