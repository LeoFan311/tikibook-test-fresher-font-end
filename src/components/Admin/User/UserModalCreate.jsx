import { Modal, Form, Input, message } from 'antd';
import { useState } from 'react';
import './User.scss';
import { callCreateUser } from '../../../services/api';

const UserModalCreate = ({ openModal, toggleModal, fetchUser }) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const onFinish = async (values) => {
        setConfirmLoading(true);
        const { fullName, password, email, phone } = values;
        const res = await callCreateUser(fullName, password, email, phone);
        if (res && res.data) {
            message.success('Tạo mới thành công');
            form.resetFields();
            setConfirmLoading(false);
            toggleModal();
            fetchUser();
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

    const handleOk = () => {
        form.submit();
    };

    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openModal}
                onCancel={() => toggleModal()}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                okText={'Tạo mới'}
                cancelText={'Hủy'}
                width={470}
            >
                <div className="modal-create-user-children">
                    <Form
                        form={form}
                        name="add-new"
                        className="create-user-form"
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
                            // label="Username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Name!',
                                },
                            ]}
                        >
                            <Input placeholder="Tên hiển thị" />
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
                            name="email"
                            // label="Password"
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
                            name="phone"
                            // label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Phone!',
                                },
                            ]}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default UserModalCreate;
