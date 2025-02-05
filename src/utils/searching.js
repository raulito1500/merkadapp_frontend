export const searchBy = (field, items, search) => {
    if (search === "") {
        return items;
    }
    search = search
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    return items.filter((item) =>
        item[field]
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(search)
    );
};
