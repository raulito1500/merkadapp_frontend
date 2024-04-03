import React from "react";
import { ListGroup, ProgressBar } from "react-bootstrap";
import { useParams } from "react-router-dom";

function MarketList() {
    const { id } = useParams();

    const [list, setList] = React.useState();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/market-list/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    const completed = data.items.filter(item => !!item.checked).length;
                    const total = data.items.length;
                    data.completedStatus = (completed / total) * 100;
                    data.fechita = new Date(data.date);
                    setList(data);
                } else {
                    throw new Error('Error al obtener los datos del servicio');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <>{list ?
            <><h1>Market List</h1>
                <p className="fs-5 col-md-8">
                    <strong>Fecha:</strong> {list.fechita.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <ProgressBar className="w-100" now={list.completedStatus} label={"50%"} visuallyHidden />
                <ListGroup>
                    {list.items.map((item, index) => (
                        <ListGroup.Item
                            as="label"
                            key={index}
                            className="list-group-item d-flex gap-3">
                            <span className="opacity-50 text-nowrap pt-1">{item.quantity}</span>
                            <span className="pt-1 form-checked-content flex-grow-1">

                                <strong>{item.product_name}</strong>
                                <small className="d-block text-body-secondary">
                                    <i className="bi bi-crosshair"></i>
                                    Mayorista
                                </small>
                                <small className="d-block text-body-secondary">
                                    <i className="bi bi-cash"></i>
                                    $10,000
                                </small>
                            </span>
                            <input
                                className="form-check-input flex-shrink-0"
                                type="checkbox"
                                onChange={() => { }}
                                checked={item.checked}
                                style={{ fontSize: "1.375em" }} />
                        </ListGroup.Item>
                    ))}
                </ListGroup></> : <span>Cargando</span>}</>
    )
}

export { MarketList }