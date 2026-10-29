import React from "react";
import { useNavigate } from "react-router-dom";
import { expensesApi } from "../../../lib/expensesApiClient";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { displayNameOf } from "../../../shared/utils/userDisplay";
import { groupApi } from "../api/groupApi";

function useGroupForm(groupId) {
    const navigate = useNavigate();
    const { request } = useApiRequest(expensesApi);
    const [name, setName] = React.useState("");
    const [category, setCategory] = React.useState("OTHER");
    const [selectedMembers, setSelectedMembers] = React.useState([]);
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {
        if (groupId) {
            request(() => Promise.all([groupApi.getById(expensesApi, groupId), groupApi.listUsers(expensesApi)]))
                .then(([groupResponse, usersResponse]) => {
                    const group = groupResponse.data;
                    setName(group.name);
                    setCategory(group.category ?? "OTHER");
                    setSelectedMembers(
                        group.members.map((member) => ({ label: displayNameOf(member), uid: member.uid }))
                    );
                    setOptions(usersResponse.data.map((user) => ({ label: displayNameOf(user), uid: user.uid })));
                })
                .catch(() => {});
        } else {
            groupApi.listUsers(expensesApi).then((response) => {
                setOptions(response.data.map((user) => ({ label: displayNameOf(user), uid: user.uid })));
            });
        }
    }, [groupId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const members = selectedMembers.map((option) =>
            typeof option === "string" ? option : option.uid ?? option.label
        );
        const save = groupId
            ? (client) => groupApi.update(client, groupId, { name, category, members })
            : (client) => groupApi.create(client, { name, category, members });

        request(save)
            .then((response) => navigate(groupId ? `/expenses/${groupId}` : `/expenses/${response.data._id}`))
            .catch(() => {});
    };

    return { name, setName, category, setCategory, selectedMembers, setSelectedMembers, options, handleSubmit };
}

export { useGroupForm };
