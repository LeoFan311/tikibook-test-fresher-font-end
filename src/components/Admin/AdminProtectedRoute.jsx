import { Button, Result } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminProtectedRoute = (props) => {
    const navigate = useNavigate();
    const accountRedux = useSelector((state) => state.account);
    const checkRole = accountRedux.user.role;
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    return (
        <>
            {isAdminRoute && checkRole === 'ADMIN' ? (
                <>{props.children}</>
            ) : (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not permitted, please login admin account."
                    style={{ minHeight: '100vh', paddingTop: '100px' }}
                    extra={
                        <Button type="primary" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    }
                />
            )}
        </>
    );
};

export default AdminProtectedRoute;
