import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context";

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
            <Table responsive="xs">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Where</th>
                        <th>Who paid</th>
                        <th>Total</th>
                        <th>Items</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {list ? list.map((item, index) => (
                        <tr key={index}>
                            <td>{item.date}</td>
                            <td>{item.where}</td>
                            <td>{item.paid_by}</td>
                            <td>{item.total}</td>
                            <td>{item.items.length}</td>
                            <td><Link to={`edit/${item.id}`}>E</Link></td>
                        </tr>
                    )): ""}
                </tbody>
            </Table></>
    )
}

export { BillList }