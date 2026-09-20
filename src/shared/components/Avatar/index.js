import React from "react";
import { displayNameOf, getInitials } from "../../utils/userDisplay";
import "./index.scss";

function Avatar({ user, size = 28, className = "" }) {
    const [photoFailed, setPhotoFailed] = React.useState(false);
    const style = { "--avatar-size": `${size}px` };

    if (user?.photoURL && !photoFailed) {
        return (
            <img
                src={user.photoURL}
                alt={displayNameOf(user)}
                className={`avatar rounded-circle ${className}`}
                style={style}
                referrerPolicy="no-referrer"
                onError={() => setPhotoFailed(true)}
            />
        );
    }

    return (
        <span className={`avatar avatar-fallback rounded-circle border ${className}`} style={style}>
            {getInitials(user)}
        </span>
    );
}

export default Avatar;
