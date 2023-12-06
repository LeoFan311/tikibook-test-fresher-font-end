import { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    DollarOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReadOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Space, Avatar } from 'antd';
const { Header, Sider, Content } = Layout;
import './Admin.scss';
import { Link, Routes, Route } from 'react-router-dom';
import UserTable from './User/UserTable';
import BookTable from './Book/BookTable';
import OrderTable from './Order';
import BookDetailPage from '../BookDetailPage';
import Dashboard from './Dashboard';
import { useSelector } from 'react-redux';

const AdminHomePage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState(''); //dashboard
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const pathName = window.location.pathname;

    useEffect(() => {
        if (pathName === '/admin') {
            setActiveMenu('dashboard');
        }
        if (pathName.includes('/users')) {
            setActiveMenu('users');
        }
        if (pathName.includes('/book')) {
            setActiveMenu('book');
        }
        if (pathName.includes('/order')) {
            setActiveMenu('order');
        }
    }, [pathName]);
    const accountRedux = useSelector((state) => state.account);
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${accountRedux.user?.avatar}`;
    return (
        <div className="admin">
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical admin-label">Admin</div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[activeMenu]}
                        items={[
                            {
                                key: 'dashboard',
                                icon: <AppstoreOutlined />,
                                label: <Link to="/admin">Dashboard</Link>,
                            },
                            {
                                key: 'users',
                                icon: <UserOutlined />,
                                label: <Link to="/admin/users">Manage User</Link>,
                                // children: [
                                //     {
                                //         label: <Link to="/admin/users">CRUD</Link>,
                                //         key: 'crud',
                                //         icon: <TeamOutlined />,
                                //     },
                                //     {
                                //         label: 'Files1',
                                //         key: 'file1',
                                //         icon: <TeamOutlined />,
                                //     },
                                // ],
                            },
                            {
                                key: 'book',
                                icon: <ReadOutlined />,
                                label: <Link to="/admin/book">Manage Books</Link>,
                            },
                            {
                                key: 'order',
                                icon: <DollarOutlined />,
                                label: <Link to="/admin/order">Manage Orders</Link>,
                            },
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />

                            <div style={{ display: 'flex' }}>
                                <div className="user" style={{ justifyItems: 'right' }}>
                                    <Space>
                                        <Avatar src={urlAvatar} />
                                        <span>{accountRedux.user.fullName}</span>
                                    </Space>
                                </div>
                                <Link to="/">
                                    <div className="user">Back to home</div>
                                </Link>
                            </div>
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                        }}
                    >
                        {window.location.pathname === '/admin' && <Dashboard />}
                        {window.location.pathname === '/admin/users' && <UserTable />}
                        {window.location.pathname === '/admin/book' && <BookTable />}
                        {window.location.pathname === '/admin/order' && <OrderTable />}
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default AdminHomePage;
