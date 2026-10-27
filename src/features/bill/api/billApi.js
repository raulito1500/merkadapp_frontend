const billApi = {
    list: (client) => client.get(`/bills`),
    getById: (client, id) => client.get(`/bills/${id}`),
    create: (client, bill) => client.post(`/bills/`, bill),
    update: (client, id, bill) => client.put(`/bills/${id}`, bill),
    merge: (client, destinationId, originIds) => client.put(`/bills/merge/${destinationId}`, originIds),
    // Products endpoint, not a bill one — the item form needs it for the product picker.
    // Move this call to a productApi once the product domain gets its own feature slice.
    getProducts: (client) => client.get(`/products/true`),
};

export { billApi };
