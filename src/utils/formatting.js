export const formatMoney = (number) => {
    return (
        "$" +
        new Intl.NumberFormat("es-ES", {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number)
    );
};

export const formatPercent = (number) => {
    return (
        new Intl.NumberFormat("es-ES", {
            style: "decimal",
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(number) + "%"
    );
};
