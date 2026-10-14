import React from "react";
import { AppContext } from "../../../app/providers/app";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { searchBy } from "../../../shared/utils/searching";
import { groupBy, groupByChecked, groupBySuggestedPlace } from "../../../shared/utils/grouping";
import { sortBy } from "../../../shared/utils/sorting";
import { marketListApi } from "../api/marketListApi";

const DEFAULT_SCREEN_SETTINGS = {
    search: "",
    sort: "ASC",
    group: "STATUS",
};

const calculateSummaryInfo = (data) => {
    data.completedItems = data.items.filter((item) => !!item.checked).length;
    data.totalItems = data.items.length;
    data.completedStatus = (data.completedItems / data.totalItems) * 100;
    data.estimated = data.items.reduce((total, item) => total + item.value, 0);
};

function useMarketListView(id) {
    const { api } = React.useContext(AppContext);
    const { request } = useApiRequest(api);

    const [list, setList] = React.useState();
    const [listGrouped, setListGrouped] = React.useState();

    React.useEffect(() => {
        request((client) => marketListApi.getById(client, id))
            .then((response) => {
                const data = response.data;
                calculateSummaryInfo(data);
                setList(data);
            })
            .catch(() => {});
    }, [id]);

    const handleDataViewOptionsChange = (screenSettings) => {
        if (!list) {
            return;
        }
        let dataGr = {};
        if (screenSettings.group === "STATUS") {
            dataGr = groupByChecked(list.items);
        } else if (screenSettings.group === "CATEGORY") {
            dataGr = groupBy("category", list.items);
        } else if (screenSettings.group === "PLACE") {
            dataGr = groupBySuggestedPlace(list.items);
        }
        for (let index in dataGr) {
            dataGr[index] = sortBy("product_name", dataGr[index], screenSettings.sort);
            dataGr[index] = searchBy("product_name", dataGr[index], screenSettings.search);
        }
        setListGrouped(dataGr);
    };

    React.useEffect(() => {
        handleDataViewOptionsChange(DEFAULT_SCREEN_SETTINGS);
    }, [list]);

    const checkItem = (itemId) => {
        const index = list.items.findIndex((item) => item.id === itemId);
        request((client) => marketListApi.checkItem(client, list.id, list.items[index].id), {
            errorTitle: "¡Ups! We have an error",
            errorType: "error",
        })
            .then(() => {
                setList({
                    ...list,
                    items: list.items.map((item, idx) => (idx === index ? { ...item, checked: true } : item)),
                });
            })
            .catch(() => {});
    };

    return { list, listGrouped, handleDataViewOptionsChange, checkItem, DEFAULT_SCREEN_SETTINGS };
}

export { useMarketListView };
