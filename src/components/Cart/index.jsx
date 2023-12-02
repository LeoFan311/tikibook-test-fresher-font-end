import {
    Col,
    Divider,
    InputNumber,
    Row,
    Empty,
    Steps,
    Form,
    Input,
    Checkbox,
    Radio,
    Result,
    Button,
    message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import './order.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { doUpdateBookAction, doDeleteItemCartAction, doPlaceOrderAction } from '../../redux/order/orderSlide';
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { callPlaceOrder } from '../../services/api';

const CartPage = () => {
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const cartProducts = useSelector((state) => state.order.carts);
    const [form] = Form.useForm();

    const handleOnChangeBookQuantity = (quantity, bookId) => {
        dispatch(
            doUpdateBookAction({
                _id: bookId,
                quantity: quantity,
            })
        );
    };
    const user = useSelector((state) => state.account.user);

    useEffect(() => {
        let sumMoney = 0;
        if (cartProducts.length > 0) {
            cartProducts.map((item) => {
                sumMoney += item.quantity * item.detail.price;
            });
        }
        setTotalPrice(sumMoney);
    }, [cartProducts]);

    useEffect(() => {
        form.setFieldsValue({
            fullName: user.fullName,
            phone: user.phone,
        });
    }, [user]);

    useEffect(() => {
        if (cartProducts.length > 0) {
            setCurrentStep(1);
        }
    }, []);

    const onFinish = async (values) => {
        const detailOrder = cartProducts.map((item) => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id,
            };
        });
        let data = {
            name: values.fullName,
            address: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: detailOrder,
        };
        const res = await callPlaceOrder(data);
        if (res && res.data) {
            message.success('Đặt hàng thành công !');
            dispatch(doPlaceOrderAction());
            setCurrentStep(2);
        }
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
            <Row gutter={[20, 20]} style={{ marginBottom: '16px' }}>
                <div style={{ background: '#fff', width: '100%', padding: '16px', borderRadius: '4px' }}>
                    <Steps
                        size="small"
                        current={currentStep}
                        items={[
                            {
                                title: 'Đơn hàng',
                            },
                            {
                                title: 'Đặt hàng',
                            },
                            {
                                title: 'Thành công',
                            },
                        ]}
                    />
                </div>
            </Row>
            {currentStep === 2 && (
                <Row gutter={[20, 20]}>
                    <div style={{ background: '#fff', width: '100%', padding: '16px', borderRadius: '4px' }}>
                        <Result
                            status="success"
                            title="Đặt hàng thông công!"
                            extra={[
                                // <Button type="primary" key="console">
                                //     Go Console
                                // </Button>,
                                <Button key="buy">Xem lịch sử mua hàng</Button>,
                            ]}
                        />
                    </div>
                </Row>
            )}
            {currentStep !== 2 && (
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24} style={{ background: '#fff', paddingTop: '10px' }}>
                        {cartProducts.length > 0 ? (
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
                                            <DeleteOutlined
                                                onClick={() => {
                                                    setCurrentStep(0);
                                                    dispatch(doDeleteItemCartAction(book));
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <Empty description={<>Không có sản phẩm nào trong giỏ hàng</>} />
                        )}
                    </Col>
                    <Col md={6} xs={24} style={{ paddingRight: 0 }}>
                        <div className="order-sum">
                            {currentStep === 1 && (
                                <Form form={form} onFinish={onFinish}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        name="fullName"
                                        label="Tên người nhận"
                                        rules={[
                                            {
                                                type: 'text',
                                                message: 'The input is not valid E-mail!',
                                            },
                                            {
                                                required: true,
                                                message: 'Please input your name!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[
                                            {
                                                type: 'text',
                                                message: 'The input is not valid number!',
                                            },
                                            {
                                                required: true,
                                                message: 'Please input your phone!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        name="address"
                                        label="Địa chỉ nhận hàng"
                                        rules={[
                                            {
                                                type: 'text',
                                                message: 'The input is not valid E-mail!',
                                            },
                                            {
                                                required: true,
                                                message: 'Please input your address!',
                                            },
                                        ]}
                                    >
                                        <TextArea />
                                    </Form.Item>
                                    <Form.Item labelCol={{ span: 24 }} name="payMethod" label="Hình thức thanh toán">
                                        <Checkbox checked={true}>Thanh toán khi nhận hàng</Checkbox>
                                    </Form.Item>
                                </Form>
                            )}

                            {currentStep === 0 && (
                                <>
                                    <Divider />
                                    <div className="calculate">
                                        <span> Tạm tính</span>
                                        <span>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(totalPrice)}
                                        </span>
                                    </div>
                                </>
                            )}

                            <Divider style={{ margin: '10px 0' }} />
                            <div className="calculate">
                                <span> Tổng tiền</span>
                                <span className="sum-final">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(totalPrice)}
                                </span>
                            </div>
                            <Divider style={{ margin: '10px 0' }} />
                            <button onClick={() => form.submit()}>Mua Hàng</button>
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default CartPage;
