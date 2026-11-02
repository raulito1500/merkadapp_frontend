const productApi = {
    list: (client) => client.get(`/products/true`),
    recommendations: (client) => client.get(`/products/recommendations`),
    billHistory: (client, productId) => client.get(`/products/${productId}/bill-items`),
};

export { productApi };
