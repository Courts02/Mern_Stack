import React from "react";
import './greetingbanner.css'; 
const GreetingBanner = ({ user }) => {
    return (
        <div className="greetingbanner">
            Welcome{user?.name ? `, ${user.name}!` : '!'}
        </div>
    );
};

export default GreetingBanner;
