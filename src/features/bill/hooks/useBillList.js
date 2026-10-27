import React from "react";
import moment from "moment";
import { AppContext } from "../../../app/providers/app";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { billApi } from "../api/billApi";

const groupBillsByDate = (bills) => {
    return bills.reduce((grouped, bill) => {
        const date = moment(bill.date).format("MMM Do, YYYY");
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(bill);
        return grouped;
    }, {});
};

function useBillList() {
    const { api, pushNotifications } = React.useContext(AppContext);
    const { request } = useApiRequest(api);
    const [merge, setMerge] = React.useState([]);
    const [listGrouped, setListGrouped] = React.useState([]);

    const loadBills = () => {
        request((client) => billApi.list(client))
            .then((response) => {
                setListGrouped(groupBillsByDate(response.data));
            })
            .catch(() => {});
    };

    React.useEffect(() => {
        loadBills();
    }, []);

    const handleCheckMerge = (event, date, index) => {
        const updatedListGrouped = { ...listGrouped };
        const group = updatedListGrouped[date];
        const updatedItem = { ...group[index] };

        updatedItem.checked = event.target.checked;
        group[index] = updatedItem;
        updatedListGrouped[date] = group;
        setListGrouped(updatedListGrouped);

        if (event.target.checked) {
            setMerge([...merge, updatedItem.id]);
        } else {
            setMerge(merge.filter((id) => id !== updatedItem.id));
        }
    };

    const handleMerge = () => {
        if (merge.length < 2) {
            pushNotifications("Pick at least two bills to merge", null, "error");
            return;
        }

        const idDestination = merge[0];
        const idsOrigen = merge.slice(1);

        request((client) => billApi.merge(client, idDestination, idsOrigen), {
            errorTitle: "¡Ups! There was an error merging bills",
            errorType: "error",
        })
            .then(() => {
                pushNotifications("¡Great news! Bills have been merged", null, "success");
                loadBills();
            })
            .catch(() => {})
            .finally(() => {
                setMerge([]);
            });
    };

    return { listGrouped, merge, handleCheckMerge, handleMerge };
}

export { useBillList };
