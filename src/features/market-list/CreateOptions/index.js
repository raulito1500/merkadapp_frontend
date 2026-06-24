import React from "react";
import { AppContext } from "../../../App/Context/app";
import PageTitle from "../../../components/PageTitle";
import MarketListSuggested from "../suggested";
import { Typeahead } from "react-bootstrap-typeahead";
import DataViewOptions from "../../../components/DataViewOptions";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

function CreateOptionsMarketList(){
    const { api, setLoading, pushNotifications } = React.useContext(AppContext);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        api.get(`/market-list/suggested`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);

    let suggestedItems = data.items?.reduce((acc, item) => {
        if (item.checked) acc.push(item);
        return acc;
    }, []);

    return (
        <div>
            <PageTitle>Create market list</PageTitle>
            <ListGroup>
                <Link to="blank" className="list-group-item d-flex gap-3 align-items-center">
                    <i className="bi bi-file-earmark text-primary" style={{ fontSize: "2rem" }}></i>
                    <div>
                        <h5 className="text-primary">Blank list</h5>
                        <p>Create a market list from a blank template</p>
                    </div>
                </Link>
                <Link to="/" className="list-group-item d-flex gap-3 align-items-center">
                    <i className="bi bi-file-earmark-check text-primary" style={{ fontSize: "2rem" }}></i>
                    <div>
                        <h5 className="text-primary">Base template list</h5>
                        <p>Create a market list including your base products</p>
                    </div>
                </Link>
                <Link to="/" className="list-group-item d-flex gap-3 align-items-center">
                    <i className="bi bi-stars text-primary" style={{ fontSize: "2rem" }}></i>
                    <div>
                        <h5 className="text-primary">Recommended market list</h5>
                        <p>
                            We have a market list with <strong>63 suggestions</strong> specially made it for
                            you
                        </p>
                    </div>
                </Link>
            </ListGroup>
            { <MarketListSuggested suggestedItems={suggestedItems} /> }
        </div>
    );
};

export default CreateOptionsMarketList;
