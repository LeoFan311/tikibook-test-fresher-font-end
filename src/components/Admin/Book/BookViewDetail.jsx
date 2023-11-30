import { Drawer, Descriptions, Badge, Upload, Divider, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const BookViewDetail = ({ open, onClose, data }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    useEffect(() => {
        if (data) {
            let imgThumbnail = {},
                imgSlider = [];
            if (data.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: data.thumbnail,
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${data.thumbnail}`,
                };
            }
            if (data.slider && data.slider.length > 0) {
                data.slider.map((item) => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    });
                });
            }

            setFileList([imgThumbnail, ...imgSlider]);
        }
    }, [data]);

    return (
        <>
            <Drawer title="Xem chi tiết sách" width={'50vw'} closable={true} onClose={onClose} open={open}>
                <Descriptions title="Thông tin sách" bordered column={2}>
                    <Descriptions.Item label="Id">{data?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sách">{data?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{data?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá tiền">{data?.price}</Descriptions.Item>
                    <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status="processing" text={data?.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(data?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(data?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>

                <div className="upload-book-img" style={{ marginTop: '40px' }}>
                    <Divider orientation="left">Book Photos</Divider>
                    <Upload
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        showUploadList={{ showRemoveIcon: false }}
                    ></Upload>
                    {fileList.length >= 1 ? null : <div>No photo</div>}
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img
                            alt="example"
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal>
                </div>
            </Drawer>
        </>
    );
};

export default BookViewDetail;
