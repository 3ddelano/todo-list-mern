import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "../../contexts/UserContext";

const RequireAuth = ({ children }) => {
    let { user } = useContext(UserContext);
    let location = useLocation();

    if (!user)
        return <Navigate to="/login" state={{ from: location }} replace />;
    return children;
};

export default RequireAuth;
