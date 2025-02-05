export const sortBy = (field, items, order = "ASC") => {
    return [...items].sort((a, b) => {
        const nameA = a[field].toLowerCase();
        const nameB = b[field].toLowerCase();

        if (nameA < nameB) {
            return order === "ASC" ? -1 : 1;
        }
        if (nameA > nameB) {
            return order === "ASC" ? 1 : -1;
        }
        return 0;
    });
};
