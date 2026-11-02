import React from "react";
import { AppContext } from "../../../app/providers/app";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { searchBy } from "../../../shared/utils/searching";
import { sortBy } from "../../../shared/utils/sorting";
import { groupBy } from "../../../shared/utils/grouping";
import { productApi } from "../api/productApi";

const DEFAULT_SCREEN_SETTINGS = {
    search: "",
    sort: "ASC",
    group: "CATEGORY",
};

function useProductList() {
    const { api, show, setShow } = React.useContext(AppContext);
    const { request } = useApiRequest(api);

    const [list, setList] = React.useState();
    const [listGrouped, setListGrouped] = React.useState([]);
    const [product, setProduct] = React.useState();

    React.useEffect(() => {
        request((client) => productApi.list(client))
            .then((response) => {
                setList(response.data);
            })
            .catch(() => {});
    }, []);

    const handleDataViewOptionsChange = (screenSettings) => {
        if (!list) {
            return;
        }
        let dataGr = {};
        if (screenSettings.group === "CATEGORY") {
            dataGr = groupBy("category", list);
        } else if (screenSettings.group === "FREQUENCY") {
            dataGr = groupBy("repeat", list);
        }
        for (let index in dataGr) {
            dataGr[index] = sortBy("name", dataGr[index], screenSettings.sort);
            dataGr[index] = searchBy("name", dataGr[index], screenSettings.search);
        }
        setListGrouped(dataGr);
    };

    React.useEffect(() => {
        handleDataViewOptionsChange(DEFAULT_SCREEN_SETTINGS);
    }, [list]);

    const handleClose = () => setShow(false);
    const handleShow = (selectedProduct) => {
        setProduct(selectedProduct);
        setShow(true);
    };

    return {
        listGrouped,
        handleDataViewOptionsChange,
        DEFAULT_SCREEN_SETTINGS,
        show,
        product,
        handleClose,
        handleShow,
    };
}

export { useProductList };
