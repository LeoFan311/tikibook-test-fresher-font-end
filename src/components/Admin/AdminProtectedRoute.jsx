import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminProtectedRoute = (props) => {
    const accountRedux = useSelector((state) => state.account);
    const checkRole = accountRedux.user.role;
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    return (
        <>
            {isAdminRoute && checkRole === 'ADMIN' ? (
                <>{props.children}</>
            ) : (
                <div style={{ padding: '10px', textAlign: 'center', height: '500px' }}>
                    <p style={{ marginTop: '150px', marginBottom: '10px' }}>Vui lòng đăng nhập tài khoản Admin</p>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        Đăng Nhập
                    </Link>
                </div>
            )}
        </>
    );
};

export default AdminProtectedRoute;
