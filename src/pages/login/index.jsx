import { Button, Checkbox, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import { callLogin } from '../../services/api';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { username, password } = values;
        const res = await callLogin(username, password);
        if (res?.data?.user) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(doLoginAction(res.data.user));
            navigate('/');
        } else {
            notification.error('Đăng nhập không thành công');
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
        <div className="login_page">
            <div className="login_form">
                <div className="heading">
                    <h2 className="text text-large">Đăng Nhập</h2>
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
                        name="username"
                        // label="Username"
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
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
