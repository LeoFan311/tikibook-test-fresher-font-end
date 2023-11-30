import { Modal, Form, Input, Popconfirm, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import './User.scss';
import { callUpdateUser } from '../../../services/api';

const UserModalEdit = ({ openModal, toggleModal, fetchUser, data }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [formData, setFormData] = useState({});

    const onFinish = async (values) => {
        const { _id, fullName, phone } = values;
        const res = await callUpdateUser(_id, fullName, phone);
        if (res && res.data) {
            message.success('Cập nhật user thành công');
            toggleModal();
            await fetchUser();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
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

    const [form] = Form.useForm();

    const handleOk = () => {
        form.submit();
    };

    useEffect(() => {
        form.setFieldsValue(data);
    });

    return (
        <>
            <Modal
                title="Cập nhật thông tin người dùng"
                open={openModal}
                onCancel={() => {
                    toggleModal();
                    form.setFieldsValue({});
                    console.log('>>> Check UserModalEdit data onCancel: ', data);
                }}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                okText={'Cập nhật'}
                cancelText={'Hủy'}
                width={470}
            >
                <div className="modal-create-user-from">
                    <Form
                        form={form}
                        name="Edit User"
                        className="edit-form"
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
                            hidden
                            name="_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Name!',
                                },
                            ]}
                        >
                            <Input placeholder="Ẩn Id" />
                        </Form.Item>
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
                            name="email"
                            // label="Password"
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
                            name="phone"
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

export default UserModalEdit;
