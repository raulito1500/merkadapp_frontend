export function displayNameOf(user) {
    if (!user) return "";
    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split("@")[0];
    return user.uid ?? "";
}

export function getInitials(user) {
    if (!user) return "";
    const source = user.displayName || user.email || "";
    return source.charAt(0).toUpperCase();
}
