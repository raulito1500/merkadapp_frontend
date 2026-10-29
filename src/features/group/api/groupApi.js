const groupApi = {
    list: (client) => client.get("/groups"),
    getById: (client, groupId) => client.get(`/groups/${groupId}`),
    getSummary: (client, groupId) => client.get(`/groups/${groupId}/summary`),
    create: (client, group) => client.post("/groups", group),
    update: (client, groupId, group) => client.patch(`/groups/${groupId}`, group),
    // Users endpoint, not a group one — Create/Edit need it for the member typeahead.
    listUsers: (client) => client.get("/users"),
};

export { groupApi };
