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

// Merges several `[{ date, total }]` monthly series into shared month buckets.
// Each backend omits months without data, so missing months are filled with 0.
// Returns { months: ["2026-06", ...], series: [[...], [...]] } in the input order.
export const mergeMonthlySeries = (seriesList) => {
    const monthKey = (date) => new Date(date).toISOString().slice(0, 7);
    const months = Array.from(new Set(seriesList.flatMap((series) => series.map((item) => monthKey(item.date))))).sort();
    const series = seriesList.map((items) => {
        const totals = Object.fromEntries(items.map((item) => [monthKey(item.date), item.total]));
        return months.map((month) => totals[month] ?? 0);
    });
    return { months, series };
};
