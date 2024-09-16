import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context/app";
import moment from "moment";
import { useUtilities } from "../../../App/Context/utilities";

function BillList() {
    const { api, setLoading } = React.useContext(AppContext);
    const [merge, setMerge] = React.useState([]);
    const [listGrouped, setListGrouped] = React.useState([]);

    const utilities = useUtilities();

    const groupBillsByDate = (bills) => {
        return bills.reduce((grouped, bill) => {
            const date = moment(bill.date).format('MMM Do, YYYY'); // Formatea la fecha
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(bill);
            return grouped;
        }, {});
    };

    const loadBills = () => {
        setLoading(true);
        api.get(`/bills`)
            .then((response) => {
                const data = groupBillsByDate(response.data);
                setListGrouped(data);
            })
            .catch((error) => {
                console.log("se presentó un error: " + error);
            })
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        loadBills();
    }, []);

    const handleCheckMerge = (event, date, index) => {
        const updatedListGrouped = {...listGrouped};
        const group = updatedListGrouped[date];
        const updatedItem = { ...group[index] };

        updatedItem.checked = event.target.checked;
        group[index] = updatedItem;
        updatedListGrouped[date] = group;
        setListGrouped(updatedListGrouped);

        if (event.target.checked) {
            setMerge([...merge, updatedItem.id]);
        } else {
            setMerge(merge.filter(id => id !== updatedItem.id));
        }
    };

    const handleMerge = () => {
        if (merge.length < 2) {
            console.log("Selecciona al menos dos facturas para fusionar.");
            return;
        }

        const idDestination = merge[0];
        const idsOrigen = merge.slice(1);

        setLoading(true);
        api.put(`/bills/merge/${idDestination}`, idsOrigen)
            .then((response) => {
                console.log("Facturas fusionadas con éxito", response.data);
                loadBills();
            })
            .catch((error) => {
                console.log("Error al fusionar las facturas: " + error);
            })
            .finally(() => {
                setMerge([]);
                setLoading(false)
            });
    };

    return (
        <>
            <h1>Bill List</h1>
            <Row className="mb-3" >
                <Col className="d-flex flex-row align-items-center justify-content-between">
                    <Link className="p-2" to={'create'}>Create</Link>
                    { merge.length > 0 ? <Button variant="outline-primary" size="sm" onClick={handleMerge}>Merge</Button> : <></> }
                </Col>
            </Row>
            {Object.keys(listGrouped).map((date, index) => (
                <Row key={index}>
                    <h2>{date}</h2>
                    {listGrouped[date].map((item, index) => (
                        <Col key={index} xs={6} sm={4} md={3} >
                            <Card className={ "shadow-sm mb-3 " + (item.checked ?  "bg-accent-15 border-1 border-primary" : "") }>
                                <Card.Body>
                                    <input
                                        className="form-check-input fs-4 position-absolute top-0 start-100 translate-middle"
                                        type="checkbox"
                                        checked={item.checked || false}
                                        onChange={(event) => handleCheckMerge(event, date, index)} />
                                        <h3 className="fs-5 mb-2"><i className="bi bi-shop-window text-primary"></i> {item.where}</h3>
                                    <strong className="text-primary text-nowrap d-block">${utilities.formatMoney(item.total)}</strong>
                                    <span className="text-muted text-wrap d-block">{item.items[0].description}{ item.items.length > 1 ? " and " + (item.items.length - 1) +" more" : ""} </span>
                                    <Link to={`edit/${item.id}`}><h6 className="btn btn-primary text-white mt-3"> Modify</h6></Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

            ))}
        </>
    )
}

export { BillList }
