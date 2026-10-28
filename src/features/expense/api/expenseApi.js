const expenseApi = {
    listPersonal: (client) => client.get("/expenses", { params: { personal: true } }),
    listByGroup: (client, groupId) => client.get("/expenses", { params: { groupId } }),
    create: (client, expense) => client.post("/expenses", expense),
    moveToGroup: (client, expenseId, groupId) => client.patch(`/expenses/${expenseId}/group`, { groupId }),
    // Groups endpoints, not expense ones — Personal needs the group list as move destinations,
    // Create needs one group's members for the "who paid" picker. Move these to a groupApi
    // once the group domain gets its own feature slice.
    listGroups: (client) => client.get("/groups"),
    getGroup: (client, groupId) => client.get(`/groups/${groupId}`),
};

export { expenseApi };
