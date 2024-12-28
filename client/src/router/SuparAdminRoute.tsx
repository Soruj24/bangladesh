/* eslint-disable @typescript-eslint/no-explicit-any */
import SignIn from '@/page/SignIn';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const SuparAdminRoute = () => {
    const user = useSelector((state: { auth: { user: any } }) => state.auth.user);

    const isSignedIn = user;
    const isSuparAdmin = user?.isSuperAdmin

    return isSignedIn && isSuparAdmin ? <Outlet /> : <SignIn />
}

export default SuparAdminRoute