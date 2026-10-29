import { groupApi } from "../../group/api/groupApi";

const expenseApi = {
    listPersonal: (client) => client.get("/expenses", { params: { personal: true } }),
    listByGroup: (client, groupId) => client.get("/expenses", { params: { groupId } }),
    create: (client, expense) => client.post("/expenses", expense),
    moveToGroup: (client, expenseId, groupId) => client.patch(`/expenses/${expenseId}/group`, { groupId }),
    // Personal needs the group list as move destinations, Create needs one group's members
    // for the "who paid" picker — both delegate to the group feature's own API.
    listGroups: groupApi.list,
    getGroup: groupApi.getById,
};

export { expenseApi };
