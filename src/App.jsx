import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from 'react-router-dom';
import LoginPage from './pages/login';
import Footer from './components/Footer';
import HomePage from './components/Home';
import RegisterPage from './pages/register';
import Header from './components/Header';
import ContactPage from './components/Contact';
import { callFetchAccount } from './services/api';
import { doGetAccountAction } from './redux/account/accountSlice';
import ProtectedRoute from './components/ProtectedRound';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './components/Admin/AdminHomePage';
import BookDetailPage from './components/BookDetailPage';
import CartPage from './components/Cart';

const Layout = () => {
    return (
        <div className="layout-app">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default function App() {
    const dispatch = useDispatch();
    const isAdmin = useSelector((state) => {
        // const isAdminRoute = window.location.pathname.startsWith('/admin');
        if (state.account.user.role === 'ADMIN') {
            return true;
        } else {
            return false;
        }
    });

    const getAccount = async () => {
        if (window.location.pathname === '/login') return;
        const res = await callFetchAccount();
        if (res && res.data) {
            dispatch(doGetAccountAction(res.data.user));
        }
    };

    useEffect(() => {
        getAccount();
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            errorElement: <div>404 not found</div>,
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
            ],
        },
        {
            path: '/admin',
            element: <AdminLayout />,
            errorElement: <div>404 not found</div>,
            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute isAuthenticated={isAdmin}>
                            <AdminHomePage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'users',
                    element: (
                        <ProtectedRoute isAuthenticated={isAdmin}>
                            <AdminHomePage />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: 'manage-user',
                    element: (
                        <ProtectedRoute isAuthenticated={isAdmin}>
                            <AdminHomePage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'book',
                    element: (
                        <ProtectedRoute isAuthenticated={isAdmin}>
                            <AdminHomePage />
                        </ProtectedRoute>
                    ),
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
