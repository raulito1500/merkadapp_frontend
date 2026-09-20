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

export const formatRepeat = (repeat) => {
    const unit = repeat.slice(-1);
    const value = parseInt(repeat.slice(0, -1), 10);

    switch (unit) {
        case 'M':
            return value === 1 ? 'Monthly' : `Each ${value} months`;
        case 'W':
            return value === 1 ? 'Weekly' : `Each ${value} weeks`;
        default:
            return `${repeat}`;
    }
};

export const formatUnits = (quantity, unit) => {
    switch (unit) {
        case 'ML':
            return quantity >= 1000 ? `${quantity / 1000}L` : `${quantity} ml`;
        case 'KG':
            return quantity < 1 ? `${quantity * 1000} gr` : `${quantity} kg`;
        case 'UN':
            return `${quantity} unit${quantity > 1 ? 's' : ''}`;
        default:
            return `${quantity} ${unit}`;
    }
};
