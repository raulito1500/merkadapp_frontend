import { productApi } from "../../product/api/productApi";

const marketListApi = {
    list: (client) => client.get(`/market-list`),
    getById: (client, id) => client.get(`/market-list/${id}`),
    getSuggested: (client) => client.get(`/market-list/suggested`),
    create: (client, list) => client.post(`/market-list`, list),
    checkItem: (client, listId, itemId) => client.put(`/market-list/${listId}/check/${itemId}`),
    // CreateBlank needs the product list for its typeahead — delegates to the product feature's API.
    getProducts: productApi.list,
};

export { marketListApi };
