import { Routes, Route, Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <>
            <div className="admin-layout-app">
                {/* <Header /> */}
                <Outlet />
                {/* <Footer /> */}
            </div>
        </>
    );
};

export default AdminLayout;
