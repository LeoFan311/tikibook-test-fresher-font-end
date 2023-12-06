import { Badge, Popover, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { convertSlug } from '../LanguageHandle/convertSlug';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const HeaderCart = () => {
    const navigate = useNavigate();
    const [renderPopover, setRenderPopover] = useState(true);
    const [cartProducts, SetCartProducts] = useState([]);
    const carts = useSelector((state) => state.order.carts);
    const accountRedux = useSelector((state) => state.account);
    const accountRole = accountRedux.user.role;

    useEffect(() => {
        SetCartProducts(carts);
    }, [carts]);

    const handleRedirectBook = (book) => {
        setRenderPopover(false);
        setTimeout(() => {
            setRenderPopover(true);
        }, [1000]);
        const slug = convertSlug(book.mainText);
        navigate(`/book/${slug}?id=${book._id}`);
    };
    return (
        <div className="cart" style={{ marginRight: '24px' }}>
            {renderPopover && (accountRole === 'ADMIN' || accountRole === 'USER') ? (
                <Popover
                    placement="bottomLeft"
                    title={() => (
                        <h3 className="carts-popover-title">
                            {cartProducts.length > 0 ? 'Sản phẩm mới thêm' : 'Không có sản phẩm nào'}
                        </h3>
                    )}
                    content={
                        <>
                            {cartProducts.length > 0 &&
                                cartProducts.map((book, index) => {
                                    // const slug = convertSlug(book.detail.mainText);
                                    return (
                                        // <Link key={index} to={`/book/${slug}?id=${book._id}`}>
                                        <div
                                            className="carts-popover"
                                            keu={index}
                                            onClick={() => {
                                                handleRedirectBook(book.detail);
                                            }}
                                        >
                                            <div className="PJ3vNU" style={{ display: 'flex' }}>
                                                <img
                                                    alt="product image"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                                                        book?.detail?.thumbnail
                                                    }`}
                                                    className="n7CR4f"
                                                />
                                                <div className="J0YaJQ">
                                                    <div className="v-center" style={{ display: 'flex' }}>
                                                        <div className="Dn8J7b" style={{ width: '300px' }}>
                                                            {book?.detail?.mainText}
                                                        </div>
                                                        <div className="z7duZT"></div>
                                                        <div className="T382iK v-center">
                                                            <div className="XqRrpe">
                                                                {new Intl.NumberFormat('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND',
                                                                }).format(book?.detail?.price)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        // </Link>
                                    );
                                })}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'right',
                                    marginTop: '10px',
                                }}
                            >
                                <Button
                                    className="views-carts-btn"
                                    onClick={() => {
                                        setRenderPopover(false);
                                        setTimeout(() => {
                                            setRenderPopover(true);
                                        }, [1000]);
                                        navigate('/cart');
                                    }}
                                >
                                    Xem Giỏ hàng
                                </Button>
                            </div>
                        </>
                    }
                >
                    <div style={{ paddingRight: '9px', cursor: 'pointer' }}>
                        <Badge count={cartProducts?.length ?? 0} showZero size={'small'}>
                            <ShoppingCartOutlined />
                        </Badge>
                    </div>
                </Popover>
            ) : (
                <div style={{ paddingRight: '9px', cursor: 'pointer' }}>
                    <Badge count={cartProducts?.length ?? 0} showZero size={'small'}>
                        <ShoppingCartOutlined />
                    </Badge>
                </div>
            )}
        </div>
    );
};

export default HeaderCart;
