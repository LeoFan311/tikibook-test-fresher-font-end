import { Col, Divider, InputNumber, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import './order.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { doUpdateBookAction, doDeleteItemCartAction } from '../../redux/order/orderSlide';
const CartPage = () => {
    const dispatch = useDispatch();
    const cartProducts = useSelector((state) => state.order.carts);
    let sumMoney = 0;
    if (cartProducts.length > 0) {
        cartProducts.map((item) => {
            sumMoney += item.quantity * item.detail.price;
        });
    }
    const handleOnChangeBookQuantity = (quantity, bookId) => {
        dispatch(
            doUpdateBookAction({
                _id: bookId,
                quantity: quantity,
            })
        );
    };

    return (
        <div
            style={{
                background: '#efefef',
                padding: '20px 0',
                width: '1230px',
                maxWidth: 'calc(100% - 32px)',
                margin: '0 auto',
            }}
            className="order-container"
        >
            <Row gutter={[20, 20]}>
                <Col md={18} xs={24} style={{ background: '#fff', paddingTop: '10px' }}>
                    {cartProducts.length > 0 &&
                        cartProducts.map((book, index) => {
                            return (
                                <div className="order-book" key={index}>
                                    <div className="book-content">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img
                                                alt="product image"
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                                                    book?.detail?.thumbnail
                                                }`}
                                            />
                                            <div className="title" style={{ textAlign: 'left' }}>
                                                {book?.detail?.mainText}
                                            </div>
                                        </div>

                                        <div className="price">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(book?.detail?.price)}
                                        </div>
                                    </div>
                                    <div className="action">
                                        <div className="quantity">
                                            <InputNumber
                                                value={book?.quantity}
                                                onChange={(value) => {
                                                    if (value < 1) return;
                                                    handleOnChangeBookQuantity(value, book?._id);
                                                }}
                                            />
                                        </div>
                                        <div className="sum">{`Tổng: ${new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(book?.quantity * book?.detail?.price)}`}</div>
                                        <DeleteOutlined onClick={() => dispatch(doDeleteItemCartAction(book))} />
                                    </div>
                                </div>
                            );
                        })}
                </Col>
                <Col md={6} xs={24} style={{ paddingRight: 0 }}>
                    <div className="order-sum">
                        <div className="calculate">
                            <span> Tạm tính</span>
                            <span>
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(sumMoney)}
                            </span>
                        </div>
                        <Divider style={{ margin: '10px 0' }} />
                        <div className="calculate">
                            <span> Tổng tiền</span>
                            <span className="sum-final">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(sumMoney)}
                            </span>
                        </div>
                        <Divider style={{ margin: '10px 0' }} />
                        <button>Mua Hàng</button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CartPage;
