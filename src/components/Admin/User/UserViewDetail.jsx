import { Drawer, Descriptions, Radio, Button, Badge } from 'antd';
import moment from 'moment';
import { useState } from 'react';

const UserViewDetail = ({ open, onClose, data }) => {
    // const [childrenDrawer, setChildrenDrawer] = useState(false);
    // const showChildrenDrawer = () => {
    //     setChildrenDrawer(true);
    // };
    // const onChildrenDrawerClose = () => {
    //     setChildrenDrawer(false);
    // };

    const [size, setSize] = useState('default');
    const onChange = (e) => {
        setSize(e.target.value);
    };

    return (
        <>
            <Drawer title="Xem chi tiết người dùng" width={'40vw'} closable={true} onClose={onClose} open={open}>
                <Descriptions title="User Info" bordered column={1}>
                    <Descriptions.Item label="Id">{data?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{data?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{data?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={data?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(data?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(data?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default UserViewDetail;
