import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { AppContext } from "../../../app/providers/app";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { billApi } from "../api/billApi";

const blankBill = () => ({
    where: "",
    paid_by: "",
    date: moment().format("YYYY-MM-DD"),
    items: [],
    taxes: [],
    bags: [],
    total: 0,
});

function useBillForm(billId) {
    const navigate = useNavigate();
    const { api } = React.useContext(AppContext);
    const { request } = useApiRequest(api);

    const [data, setData] = React.useState(billId ? undefined : blankBill());
    const [products, setProducts] = React.useState();
    const [errors, setErrors] = React.useState({});

    const handleFormChange = (field, value) => {
        setData({ ...data, [field]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!data.where) newErrors.where = "Where is required";

        data.items.forEach((item, index) => {
            if (item.quantity <= 0) newErrors[`items[${index}].quantity`] = "Quantity must be greater than 0";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    React.useEffect(() => {
        if (!billId) return;
        request((client) => billApi.getById(client, billId))
            .then((response) => {
                const loaded = response.data;
                loaded.date = moment(loaded.date).format("YYYY-MM-DD");
                if (!loaded.taxes) loaded.taxes = [];
                if (!loaded.bags) loaded.bags = [];
                if (!loaded.items) loaded.items = [];
                setData(loaded);
            })
            .catch(() => {});
    }, [billId]);

    React.useEffect(() => {
        request((client) => billApi.getProducts(client))
            .then((response) => {
                setProducts(response.data);
            })
            .catch(() => {});
    }, []);

    const calculateTotalAmount = (calcData) => {
        let sum = 0;
        sum += calcData.items.reduce((acc, item) => acc + item.total, 0);
        sum += calcData.bags.reduce((acc, bag) => acc + bag.total, 0);
        sum += calcData.taxes.reduce((acc, tax) => acc + tax.total, 0);
        return sum;
    };

    const handleChange = (collection, index, item) => {
        const updatedItems = [...data[collection]];
        updatedItems[index] = item;

        const calcData = { ...data, [collection]: updatedItems };
        calcData.total = calculateTotalAmount(calcData);

        setData(calcData);
    };

    const handleBlur = (collection, index, item) => {
        const updatedItems = [...data[collection]];
        updatedItems[index] = item;
        setData({ ...data, [collection]: updatedItems });
    };

    const handleAddItem = () => {
        const newItem = {
            product_id: "",
            quantity: 0,
            description: "",
            brand: "",
            content: "",
            unit: "",
            is_additional: false,
            unit_value: 0,
            discount: 0,
            total: 0,
        };

        setData({ ...data, items: [...data.items, newItem] });
    };

    const handleAddBag = () => {
        const newBag = { quantity: 0, value: 0, total: 0 };
        setData({ ...data, bags: [...data.bags, newBag] });
    };

    const handleAddTax = () => {
        const newTax = { concept: "", total: 0 };
        setData({ ...data, taxes: [...data.taxes, newTax] });
    };

    const handleRemoveItem = (index) => {
        const updatedItems = [...data.items];
        updatedItems.splice(index, 1);
        setData({ ...data, items: updatedItems });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validate()) return;

        const bill = {
            ...data,
            date: new Date(data.date + "T00:00:00").toISOString(),
        };

        const save = billId
            ? (client) => {
                  delete bill.id;
                  return billApi.update(client, billId, bill);
              }
            : (client) => billApi.create(client, bill);

        request(save, { errorTitle: "¡Ups! We have an error", errorType: "error" })
            .then(() => navigate("/bills"))
            .catch(() => {});
    };

    return {
        data,
        products,
        errors,
        handleFormChange,
        handleChange,
        handleBlur,
        handleAddItem,
        handleAddBag,
        handleAddTax,
        handleRemoveItem,
        handleSubmit,
    };
}

export { useBillForm };
