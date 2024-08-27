import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context";
import moment from "moment";

function BillList() {
    const { api, setLoading } = React.useContext(AppContext);
    const [list, setList] = React.useState([]);
    const [merge, setMerge] = React.useState([]);

    const loadBills = () => {
        setLoading(true);
        api.get(`/bills`)
            .then((response) => {
                const data = response.data;
                setList(data);
            })
            .catch((error) => {
                console.log("se presentó un error: " + error);
            })
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        loadBills(); 
    }, []);

    const handleCheckMerge = (event, index) => {
        const updatedList = [...list];
        updatedList[index].checked = event.target.checked;
        setList(updatedList);

        if (event.target.checked) {
            setMerge([...merge, updatedList[index].id]);
        } else {
            setMerge(merge.filter(id => id !== updatedList[index].id));
        }
    };

    const handleMerge = () => {
        if (merge.length < 2) {
            console.log("Selecciona al menos dos facturas para fusionar.");
            return;
        }

        const idDestination = merge[0];  // Por ejemplo, usar el primer ID como destino
        const idsOrigen = merge.slice(1);  // El resto de los IDs como origen

        setLoading(true);
        api.put(`/bills/merge/${idDestination}`, idsOrigen)
            .then((response) => {
                console.log("Facturas fusionadas con éxito", response.data);
                loadBills();
            })
            .catch((error) => {
                console.log("Error al fusionar las facturas: " + error);
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <h1>Bill List</h1>
            <Link to={'create'}>Create</Link>
            <Button variant="outline-primary" size="sm" onClick={handleMerge}>Merge</Button>
            <Row>
                {list.length > 0 ? list.map((item, index) => (
                    <Col key={index} xs={6} sm={4} md={3} >
                        <Card className="shadow-sm mb-3">
                            <Card.Body>
                                <input
                                    className="form-check-input flex-shrink-1"
                                    type="checkbox"
                                    checked={item.checked || false}
                                    onChange={(event) => handleCheckMerge(event, index)}
                                    style={{ fontSize: "1.375em" }} />
                                <h6 className="text-primary"><Link to={`edit/${item.id}`}><i class="bi bi-shop-window"></i>{item.where}</Link></h6>
                                <span className="text-nowrap d-block">{moment(item.date).format('MMM Do')}</span>
                                <span className="text-nowrap d-block">${item.total}</span>
                                <span className="text-nowrap d-block">{item.paid_by}</span>
                                <span className="text-muted text-nowrap d-block">({item.items.length}) items</span>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : "No bills available"}
            </Row>
        </>
    )
}

export { BillList }
