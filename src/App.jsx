import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from 'react-router-dom';
import LoginPage from './pages/login';
import Footer from './components/Footer';
import HomePage from './components/Home';
import RegisterPage from './pages/register';
import Header from './components/Header';
import ContactPage from './components/Contact';
import { callFetchAccount } from './services/api';
import { doGetAccountAction } from './redux/account/accountSlice';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './components/Admin/AdminHomePage';
import BookDetailPage from './components/BookDetailPage';
import CartPage from './components/Cart';
import OrderHistory from './components/History';
import NotFound from './components/NotFound';
import Loading from './components/Loading';
import { Button, Result } from 'antd';
import AdminProtectedRoute from './components/Admin/AdminProtectedRoute';

const Layout = () => {
    const navigate = useNavigate();
    const accountRedux = useSelector((state) => state.account);
    const checkRole = accountRedux.user.role;
    const isCartRoute = window.location.pathname.startsWith('/cart');
    const isHistoryRoute = window.location.pathname.startsWith('/history');
    return (
        <div className="layout-app">
            {(isCartRoute || isHistoryRoute) && checkRole !== 'ADMIN' && checkRole !== 'USER' ? (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not permitted, you need to login to access this page."
                    style={{ minHeight: '100vh', paddingTop: '100px' }}
                    extra={[
                        <Button type="primary" onClick={() => navigate('/')}>
                            Back Home
                        </Button>,
                        <Button type="primary" onClick={() => navigate('/login')}>
                            Login
                        </Button>,
                    ]}
                />
            ) : (
                <>
                    <Header />
                    <Outlet />
                    <Footer />
                </>
            )}
        </div>
    );
};

export default function App() {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(true);

    const fetchAccount = async () => {
        if (window.location.pathname === '/login') return;
        const res = await callFetchAccount();
        if (res && res.data) {
            dispatch(doGetAccountAction(res.data.user));
        }
    };
    useEffect(() => {
        fetchAccount();
        setTimeout(() => {
            setIsFetching(false);
        }, [1000]);
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            errorElement: <NotFound />,
            children: [
                { index: true, element: <HomePage /> },

                {
                    path: 'contact',
                    element: <ContactPage />,
                },
                {
                    path: 'book/:slug',
                    element: <BookDetailPage />,
                },
                {
                    path: 'cart',
                    element: <CartPage />,
                },
                {
                    path: 'history',
                    element: <OrderHistory />,
                },
            ],
        },
        {
            path: '/admin',
            element: isFetching ? (
                <Loading />
            ) : (
                <AdminProtectedRoute>
                    <AdminLayout />
                </AdminProtectedRoute>
            ),

            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    element: <AdminHomePage />,
                },
                {
                    path: 'users',
                    element: <AdminHomePage />,
                },

                {
                    path: 'manage-user',
                    element: <AdminHomePage />,
                },
                {
                    path: 'book',
                    element: <AdminHomePage />,
                },
                {
                    path: 'order',
                    element: <AdminHomePage />,
                },
            ],
        },

        {
            path: '/login',
            element: <LoginPage />,
        },

        {
            path: '/register',
            element: <RegisterPage />,
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}
