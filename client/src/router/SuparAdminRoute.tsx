import SignIn from '@/page/SignIn';
import { Outlet } from 'react-router-dom';

const SuparAdminRoute = () => {
    const isSignedIn = true;
    const isSuparAdmin = true

    return isSignedIn && isSuparAdmin ? <Outlet /> : <SignIn />
}

export default SuparAdminRoute