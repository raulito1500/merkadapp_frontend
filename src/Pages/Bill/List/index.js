import React from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context";
import moment from "moment";

function BillList() {
    const {
        api,
        setLoading
    } = React.useContext(AppContext);

    const [list, setList] = React.useState();

    React.useEffect(() => {
        setLoading(true);
        api
            .get(`/bills`)
            .then((response) => {
                const data = response.data;
                setList(data);
            })
            .catch(error => {
                console.log("se presentó un error: " + error);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <><h1>Bill List</h1>
            <Link to={'create'}>Create</Link>
            <Row>
                {list ? list.map((item, index) => (
                    <Col key={index} xs={6} sm={4} md={3} >
                        <Card className="shadow-sm mb-3">
                            <Card.Body>
                                <h6 className="text-primary"><Link to={`edit/${item.id}`}>{item.where}</Link></h6>
                                <span className="text-nowrap d-block">{moment(item.date).format('MMM Do')}</span>
                                <span className="text-nowrap d-block">${item.total}</span>
                                <span className="text-nowrap d-block">{item.paid_by}</span>
                                <span className="text-muted text-nowrap d-block">({item.items.length}) items</span>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : ""}

            </Row>
        </>
    )
}

export { BillList }