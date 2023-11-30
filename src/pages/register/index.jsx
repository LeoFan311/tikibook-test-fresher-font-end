// import { LockOutlined, UserOutlined } from "icons";
import { useState } from 'react';
import { Button, Checkbox, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from '../../services/api';
import './register.scss';

const RegisterPage = () => {
    const navigate = useNavigate();
    // const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        const res = await callRegister(fullName, email, password, phone);
        if (res?.data?._id) {
            message.success('Đăng ký thành công!');
            navigate('/login');
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                // description:
                //     res.message && res.message.length > 0
                //         ? res.message[0]
                //         : res.message,
            });
        }
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    return (
        <div className="register_page">
            <div className="register_form">
                <div className="heading">
                    <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: false,
                    }}
                    onFinish={onFinish}
                    style={{
                        maxWidth: 600,
                    }}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        name="fullName"
                        // label="Address"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Full Name!',
                            },
                        ]}
                    >
                        <Input placeholder="Full Name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        // label="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input type="email" placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        // label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input type="password" placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        // label="Phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Phone!',
                            },
                        ]}
                    >
                        <Input placeholder="Phone" />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
