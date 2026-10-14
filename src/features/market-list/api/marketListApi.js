const marketListApi = {
    list: (client) => client.get(`/market-list`),
    getById: (client, id) => client.get(`/market-list/${id}`),
    getSuggested: (client) => client.get(`/market-list/suggested`),
    create: (client, list) => client.post(`/market-list`, list),
    checkItem: (client, listId, itemId) => client.put(`/market-list/${listId}/check/${itemId}`),
    // Products endpoint, not a market-list one — CreateBlank needs it for the typeahead.
    // Move this call to a productApi once the product domain gets its own feature slice.
    getProducts: (client) => client.get(`/products/true`),
};

export { marketListApi };
