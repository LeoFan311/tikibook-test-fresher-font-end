import { useState } from 'react';
import {
    AppstoreOutlined,
    DollarOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReadOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;
import './Admin.scss';
import { Link, Routes, Route } from 'react-router-dom';
import UserTable from './User/UserTable';
import BookTable from './Book/BookTable';

const AdminHomePage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <div className="admin">
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical admin-label">Admin</div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={[
                            {
                                key: '1',
                                icon: <AppstoreOutlined />,
                                label: <Link to="/admin">Dashboard</Link>,
                            },
                            {
                                key: '2',
                                icon: <UserOutlined />,
                                children: [
                                    {
                                        label: <Link to="/admin/users">CRUD</Link>,
                                        key: 'crud',
                                        icon: <TeamOutlined />,
                                    },
                                    {
                                        label: 'Files1',
                                        key: 'file1',
                                        icon: <TeamOutlined />,
                                    },
                                ],
                                label: 'Manage User',
                            },
                            {
                                key: '3',
                                icon: <ReadOutlined />,
                                label: <Link to="/admin/book">Manage Books</Link>,
                            },
                            {
                                key: '4',
                                icon: <DollarOutlined />,
                                label: 'Manage Orders',
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
                        <div className="user">Admin Name and Action</div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                        }}
                    >
                        {(window.location.pathname === '/admin/users' || window.location.pathname === '/admin') && (
                            <UserTable />
                        )}
                        {window.location.pathname === '/admin/book' && <BookTable />}
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default AdminHomePage;
