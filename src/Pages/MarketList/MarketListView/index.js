import React from "react";
import { ListGroup, ProgressBar } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../App/Context";
import moment from "moment";

function MarketListView() {
    const { id } = useParams();

    const {
        api,
        setLoading
    } = React.useContext(AppContext);

    const [list, setList] = React.useState();

    React.useEffect(() => {
        setLoading(true);
        api
            .get(`/market-list/${id}`)
            .then((response) => {
                const data = response.data;
                data.completedItems = data.items.filter(item => !!item.checked).length;
                data.totalItems = data.items.length;
                data.completedStatus = (data.completedItems / data.totalItems) * 100;
                setList(data);
            })
            .catch(error => {
                console.log("se presentó un error: " + error);
            })
            .finally(() => setLoading(false));
    }, []);

    const checkItem = (event, idItem) => {
        const index = list.items.findIndex((item) => item.id === idItem);
        setLoading(true);
        api
            .put(`/market-list/${list.id}/check/${list.items[index].id}`)
            .then((response) => {
                list.items[index].checked = true;
                setList(list);
            })
            .catch(error => {
                console.log("se presentó un error: " + error);
            })
            .finally(() => setLoading(false));
    }
    return (
        <>{list ?
            <><h1>Market List</h1>
                <p className="fs-5 col-md-8">
                    <strong>Fecha:</strong> {moment(list.date).format('MMM Do')}
                </p>
                <ProgressBar variant="success" className="w-100 mb-2" now={list.completedStatus} label={`${list.completedItems} of ${list.totalItems}`} />
                <ListGroup>
                    {list.items.map((item, index) => (
                        <ListGroup.Item
                            as="label"
                            key={item.id}
                            className="list-group-item d-flex gap-3">
                            <span className="opacity-50 text-nowrap pt-1 flex-shrink-1">{item.quantity}</span>
                            <span className="pt-1 form-checked-content flex-grow-1">
                                <strong>{item.product_name}</strong>
                                <div className="d-flex justify-content-start">
                                    {item.where != "" && item.value != 0 ?
                                        <><small className="me-3 text-body-secondary">
                                            <i className="me-1 bi bi-crosshair"></i> {item.where}
                                        </small>
                                            <small className="me-3 text-body-secondary">
                                                <i className="me-1 bi bi-cash"></i> ${item.value}
                                            </small>
                                            <small className="me-3 text-body-secondary">
                                                <i className="me-1 bi bi-calendar-event"></i> {moment(item.date).format("MMM D")}
                                            </small> </> : ""}

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