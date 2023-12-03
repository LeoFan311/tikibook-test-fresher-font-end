import { Modal, Form, Input, InputNumber, Select, Upload, message, notification, Divider } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import './Book.scss';
import { callBookCategory, callCreateBook, callUploadBookImg } from '../../../services/api';

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
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

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const BookModalAdd = ({ openModal, closeModal, fetchBook }) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    // const [thumbnailFileList, setThumbnailFileList] = useState([]);
    // const [sliderFileList, setSliderFileList] = useState([]);

    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [listCategory, setListCategory] = useState([]);

    const fetchCategory = async () => {
        const res = await callBookCategory();

        if (res && res.data) {
            const d = res.data.map((item) => {
                return { label: item, value: item };
            });
            setListCategory(d);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleImgOnChange = (props, type) => {
        if (props.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoadingThumbnail(true);
        }
        // type ? setSliderFileList(props.fileList) : setThumbnailFileList(props.fileList);

        if (props.file.status === 'done') {
            type ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    const customUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        // const res = await callUploadBookImg(file);
        // if (res && res.data) {
        //     setDataThumbnail([
        //         {
        //             name: res.data.fileUploaded,
        //             uid: file.uid,
        //         },
        //     ]);
        //     onSuccess('ok');
        // } else {
        //     onError('Đã có lỗi xảy ra khi upload file');
        // }

        onSuccess('ok');
    };

    const customUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataSlider((prev) => [
                ...prev,
                {
                    name: res.data.fileUploaded,
                    uid: file.uid,
                },
            ]);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi xảy ra khi upload file');
        }
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([]);
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    };

    const onFinish = async (values) => {
        if (dataThumbnail.length === 0) {
            notification.error({
                message: 'Loi validate',
                description: 'Vui long upload anh thumbnail',
            });
            return;
        }
        if (dataSlider.length === 0) {
            notification.error({
                message: 'Loi validate',
                description: 'Vui long upload anh slider',
            });
        }

        const { mainText, author, price, sold, quantity, category } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map((item) => item.name);

        const res = await callCreateBook({ thumbnail, slider, mainText, author, price, sold, quantity, category });

        if (res && res.data) {
            message.success('Tạo mới book thành công');
            form.resetFields();
            setDataSlider([]);
            setDataThumbnail([]);
            closeModal();
            await fetchBook();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res,
            });
        }
    };

    const handleOk = () => {
        form.submit();
    };

    return (
        <>
            <Modal
                title="Thêm mới sách"
                open={openModal}
                onCancel={() => {
                    closeModal();
                    form.resetFields();
                    setDataThumbnail([]);
                    setDataSlider([]);
                }}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                okText={'Tạo mới'}
                cancelText={'Hủy'}
                //do not close when click outside
                maskClosable={false}
                width={600}
            >
                <Divider />
                <div className="modal-add-book-children">
                    <Form
                        form={form}
                        name="add-new"
                        className="add-book-from-form"
                        initialValues={{
                            remember: false,
                        }}
                        onFinish={onFinish}
                        style={{
                            maxWidth: 600,
                        }}
                        validateMessages={validateMessages}
                    >
                        <div className="flex_50">
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainText"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên sách!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên tác giả',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        <div className="flex_25">
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá sách',
                                    },
                                ]}
                            >
                                <InputNumber
                                    addonAfter="VNĐ"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Loại sách"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn loại sách',
                                    },
                                ]}
                            >
                                <Select defaultValue={null} showSearch allowClear options={listCategory} />
                            </Form.Item>
                            <Form.Item
                                className="book_quantity"
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng',
                                    },
                                ]}
                            >
                                <InputNumber min={1} />
                            </Form.Item>
                            <Form.Item
                                className="book_sold_number"
                                labelCol={{ span: 24 }}
                                label="Đã bán"
                                name="sold"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng đã bán',
                                    },
                                ]}
                            >
                                <InputNumber min={0} />
                            </Form.Item>
                        </div>
                        <div className="upload-thumbnail" style={{ display: 'flex' }}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                                style={{ width: '50%', marginRight: '8px' }}
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    // showUploadList={false}
                                    // fileList={thumbnailFileList}
                                    customRequest={customUploadFileThumbnail}
                                    onChange={handleImgOnChange}
                                    beforeUpload={beforeUpload}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemoveFile(file, 'slider')}
                                >
                                    <div>
                                        {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                            <Form.Item labelCol={{ span: 24 }} label="Ảnh Slider" name="slider">
                                <Upload
                                    multiple
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={customUploadFileSlider}
                                    onChange={(info) => handleImgOnChange(info, 'slider')}
                                    beforeUpload={beforeUpload}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemoveFile(file, 'slider')}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                            <Modal
                                open={previewOpen}
                                title={previewTitle}
                                footer={null}
                                onCancel={() => setPreviewOpen(false)}
                            >
                                <img
                                    alt="example"
                                    style={{
                                        width: '100%',
                                    }}
                                    src={previewImage}
                                />
                            </Modal>
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default BookModalAdd;
