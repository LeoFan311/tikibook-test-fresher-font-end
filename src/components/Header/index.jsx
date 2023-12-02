import { useDispatch, useSelector } from 'react-redux';
import './header.scss';
import { FaSearch, FaReact, FaUser } from 'react-icons/fa';
import { Avatar, Dropdown, Space } from 'antd';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { Link, useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { callLogout } from '../../services/api';
import HeaderCart from './headerCart';

const Header = () => {
    console.log('Check render header');
    const dispatch = useDispatch();
    const accountRedux = useSelector((state) => {
        if (state.account.isAuthenticated) {
            return state.account;
        } else {
            return {};
        }
    });

    const handleLogout = async () => {
        const res = await callLogout();
        if (res?.statusCode === 201) {
            dispatch(doLogoutAction());
        }
    };

    let menuProps = {
        items: [
            {
                label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
                key: 'user',
            },
            {
                label: (
                    <Link to="/history" style={{ cursor: 'pointer' }}>
                        Lịch sử mua hàng
                    </Link>
                ),
                key: 'history',
            },
            {
                label: (
                    <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                        Đăng xuất
                    </label>
                ),
                key: 'logout',
            },
        ],
    };

    if (accountRedux?.user?.role === 'ADMIN') {
        menuProps.items.unshift({
            label: <Link to="/admin">Trang quản trị</Link>,
            key: 'admin',
        });
    }
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${accountRedux.user?.avatar}`;

    return (
        <div className="home-header">
            <div className="content-wrapper">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div className="logo" style={{ cursor: 'pointer' }}>
                        <FaReact />
                        <span className="logo-name">DAMON SHOP</span>
                    </div>
                </Link>

                <div className="search-wrapper" style={{ maxWidth: '500px' }}>
                    <div className="search">
                        <div className="search-icon">
                            <FaSearch />
                        </div>
                        <input type="text" placeholder="Chọn hàng mua" />
                        <div className="search-button">Tìm kiếm</div>
                    </div>
                </div>

                <div className="user">
                    <Dropdown menu={menuProps} trigger={['hover']}>
                        {accountRedux.isAuthenticated ? (
                            <Space>
                                <Avatar src={urlAvatar} />
                                <span>{accountRedux.user.fullName}</span>
                            </Space>
                        ) : (
                            <>
                                <FaUser />
                                <span className="login">
                                    <Link to="/login">Đăng Nhập</Link>
                                </span>
                            </>
                        )}
                    </Dropdown>
                </div>
                <HeaderCart />
            </div>
        </div>
    );
};

export default memo(Header);
