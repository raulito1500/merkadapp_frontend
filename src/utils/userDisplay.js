export function displayNameOf(user) {
    if (!user) return "";
    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split("@")[0];
    return user.uid ?? "";
}
