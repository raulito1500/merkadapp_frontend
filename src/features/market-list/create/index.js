import React from "react";
import { AppContext } from "../../../App/Context/app";
import PageTitle from "../../../components/PageTitle";
import MarketListSuggested from "../suggested";

const CreateMarketList = () => {
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
            <MarketListSuggested suggestedItems={suggestedItems}/>
        </div>
    );
};

export default CreateMarketList;
