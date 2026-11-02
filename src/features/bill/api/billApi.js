import { productApi } from "../../product/api/productApi";

const billApi = {
    list: (client) => client.get(`/bills`),
    getById: (client, id) => client.get(`/bills/${id}`),
    create: (client, bill) => client.post(`/bills/`, bill),
    update: (client, id, bill) => client.put(`/bills/${id}`, bill),
    merge: (client, destinationId, originIds) => client.put(`/bills/merge/${destinationId}`, originIds),
    // The item form needs the product list for its picker — delegates to the product feature's API.
    getProducts: productApi.list,
};

export { billApi };
