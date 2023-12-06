import { UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, Modal, Row, Tabs, Upload, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callChangeUserPassword, callUpdateUserInfo, callUploadAvatar } from '../../services/api';
import { doUpdateUserInfoAction } from '../../redux/account/accountSlice';

const items = [
    {
        key: '1',
        label: 'Cập nhật thông tin',
        children: <></>,
    },
    {
        key: '2',
        label: 'Đổi mật khẩu',
        children: <></>,
    },
];

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

const AccountManage = (props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [currentTab, setCurrentTab] = useState('1');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [userAvatar, setUserAvatar] = useState('');

    let accountRedux = useSelector((state) => {
        if (state.account.isAuthenticated) {
            return state.account;
        } else {
            return {};
        }
    });

    const urlAvatarRedux = accountRedux.isAuthenticated
        ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${accountRedux.user?.avatar}`
        : '';

    useEffect(() => {
        let userInfo = {};
        if (accountRedux.isAuthenticated) {
            userInfo = {
                _id: accountRedux.user.id,
                fullName: accountRedux.user.fullName,
                email: accountRedux.user.email,
                phone: accountRedux.user.phone,
            };
            setUserAvatar(accountRedux.user.avatar);
        }
        setAvatarUrl(urlAvatarRedux);

        form.setFieldsValue(userInfo);
    }, [accountRedux.user]);

    const handleCancel = () => {
        props.setIsModalOpen(false);
    };

    const customUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadAvatar(file);
        if (res && res.data) {
            setUserAvatar(res.data.fileUploaded);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi xảy ra khi upload file');
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const onChange = ({ fileList }) => {
        const file = fileList[0].originFileObj;
        getBase64(file, (url) => {
            setAvatarUrl(url);
        });
    };

    const onFinishChangeInfo = async (values) => {
        const { _id, phone, fullName } = values;
        console.log('>>> Check value: ', values);
        const res = await callUpdateUserInfo(_id, phone, fullName, userAvatar);
        console.log('Check res: ', res);
        if (res && res.data) {
            dispatch(doUpdateUserInfoAction({ avatar: userAvatar, phone, fullName }));
            message.success('Cập nhật thông tin thành công');

            localStorage.removeItem('access_token');
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
    };

    const handleChangePassword = async (values) => {
        const { email, oldPass, newPass } = values;
        const res = await callChangeUserPassword(email, oldPass, newPass);
        if (res && res.data) {
            message.success('Đổi mật khẩu thành công');
            form.setFieldsValue({
                oldPass: '',
                newPass: '',
            });
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
    };

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={props.isModalOpen}
                onCancel={handleCancel}
                maskClosable={false}
                width={currentTab === '1' ? 600 : 400}
                footer={null}
            >
                <Tabs defaultActiveKey={currentTab} items={items} onChange={(key) => setCurrentTab(key)} />
                {currentTab === '1' && (
                    <Row gutter={[80, 0]} style={{ marginBottom: '5px' }}>
                        <Col md={8}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    src={avatarUrl}
                                    alt="Avatar"
                                    size={120}
                                    style={{ border: '2px solid #80808059', marginBottom: '24px', marginTop: '10px' }}
                                ></Avatar>
                                <Upload
                                    customRequest={customUploadFileThumbnail}
                                    onChange={onChange}
                                    headers={{ authorization: 'authorization-text' }}
                                    showUploadList={false}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                            </div>
                        </Col>
                        <Col md={16}>
                            <Form form={form} validateMessages={validateMessages} onFinish={onFinishChangeInfo}>
                                <Form.Item hidden labelCol={{ span: 24 }} label="ID" name="_id">
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Email!',
                                        },
                                    ]}
                                >
                                    <Input disabled />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Tên hiển thị"
                                    name="fullName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Full Name!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your phone!',
                                        },
                                        { type: 'text', message: 'Invalid phone!' },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item>
                                    <Button htmlType="submit">Cập nhật</Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                )}
                {currentTab === '2' && (
                    <Form
                        form={form}
                        validateMessages={validateMessages}
                        onFinish={handleChangePassword}
                        style={{ width: '350px', margin: 'auto', marginTop: '12px', marginBottom: '12px' }}
                    >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your old password!',
                                },
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Mật khẩu cũ"
                            name="oldPass"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your old password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Mật khẩu mới"
                            name="newPass"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your new password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" onClick={() => console.log('Check button onclick')}>
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </>
    );
};

export default AccountManage;
