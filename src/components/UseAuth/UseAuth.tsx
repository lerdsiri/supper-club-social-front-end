import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { RootState } from "types";
import { userActions } from "store/userSlice";

export const IsUserAuthenticated = () => {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.user.token);
    const user: any = token && jwt_decode(token);

    if(token) {
        if(user.isBanned) {
            dispatch(userActions.clearUser());
            alert("Login failed. You are currently banned from our site.");
            return <Navigate to="/" />
        }

        return <Outlet />
    } 
    
    return <Navigate to="/" />
}

export const IsUserUnauthenticated = () => {
    const token = useSelector((state: RootState) => state.user.token);
    
    if(token) {
        return <Navigate to="/mypage" />
    } else {
        return <Outlet />
    }
}

export const IsUserAdmin = () => {
    const token = useSelector((state: RootState) => state.user.token);
    const user: any = token && jwt_decode(token);

    if(token) {
        if(user?.isAdmin === false) {
            alert("Access denied. Sorry, you are not admin.");
            return <Navigate to="/mypage" />
        }

        return <Outlet />
    }

    return <Navigate to="/" /> 
}
