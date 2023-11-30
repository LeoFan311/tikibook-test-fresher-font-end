import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';

const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const isAuthenticated = props.isAuthenticated;

    return (
        <>
            {isAuthenticated ? (
                <>{props.children}</>
            ) : (
                // navigate("/login")
                // <Navigate to="/login" />
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

export default ProtectedRoute;
