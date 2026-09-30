export const groupBy = (field, items) => {
    return items.reduce((grouped, item) => {
        if (!grouped[item[field]]) {
            grouped[item[field]] = [];
        }
        grouped[item[field]].push(item);
        return grouped;
    }, {});
};

export const groupBySuggestedPlace = (items) => {
    const grouped = {
        UNSUGGESTED: [],
    };
    return items.reduce((grouped, item) => {
        const where = item.where === "" ? "UNSUGGESTED" : item.where;
        if (!grouped[where]) {
            grouped[where] = [];
        }
        grouped[where].push(item);
        return grouped;
    }, {});
};

export const groupByChecked = (items) => {
    const grouped = {
        UNCHECKED: [],
        CHECKED: [],
    };
    items.forEach((item) => {
        const checkedStatus = item.checked ? "CHECKED" : "UNCHECKED";
        grouped[checkedStatus].push(item);
    });
    return grouped;
};
