import { Modal, Form, Input, InputNumber, Select, Upload, message, notification, Divider } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Book.scss';
import { callBookCategory, callUpdateBook, callUploadBookImg } from '../../../services/api';

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

const BookModalEdit = ({ openModal, closeModal, data, fetchBook }) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [listCategory, setListCategory] = useState([]);

    const [initForm, setInitForm] = useState(null);

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

        if (data?._id) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: data.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${data.thumbnail}`,
                },
            ];

            const arrSlider = data?.slider?.map((item) => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                };
            });

            const init = {
                _id: data._id,
                mainText: data.mainText,
                author: data.author,
                price: data.price,
                category: data.category,
                quantity: data.quantity,
                sold: data.sold,
                thumbnail: { fileList: arrThumbnail },
                slider: { fileList: arrSlider },
            };
            setInitForm(init);
            setDataThumbnail(arrThumbnail);
            setDataSlider(arrSlider);
            form.setFieldsValue(init);
        }

        return () => {
            form.resetFields();
        };
    }, [data]);

    const handleImgOnChange = (props, type) => {
        if (props.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoadingThumbnail(true);
        }

        if (props.file.status === 'done') {
            type ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    const customUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataThumbnail([
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

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handlePreview = async (file) => {
        if (file.url && !file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
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
        // console.log('>>> check values: ', values);
        // console.log('>>> check data thumbnail: ', dataThumbnail);
        // console.log('>>> check data slider: ', dataSlider);

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

        const { _id, mainText, author, price, sold, quantity, category } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map((item) => item.name);

        const res = await callUpdateBook({ _id, thumbnail, slider, mainText, author, price, sold, quantity, category });

        if (res && res.data) {
            message.success('Cập nhật book thành công');
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
                title="Cập nhật sách"
                open={openModal}
                onCancel={() => {
                    closeModal();
                    form.resetFields();
                    setInitForm(null);
                    setDataThumbnail([]);
                    setDataSlider([]);
                }}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                okText={'Cập nhật'}
                cancelText={'Hủy'}
                maskClosable={false}
                width={600}
            >
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
                        <Divider />
                        <div className="flex_50">
                            <Form.Item hidden labelCol={{ span: 24 }} label="ID" name="_id">
                                <Input />
                            </Form.Item>
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
                                    customRequest={customUploadFileThumbnail}
                                    onChange={handleImgOnChange}
                                    beforeUpload={beforeUpload}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemoveFile(file, 'slider')}
                                    defaultFileList={initForm?.thumbnail?.fileList ?? []}
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
                                    // showUploadList={false}
                                    customRequest={customUploadFileSlider}
                                    onChange={(info) => handleImgOnChange(info, 'slider')}
                                    beforeUpload={beforeUpload}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemoveFile(file, 'slider')}
                                    defaultFileList={initForm?.slider?.fileList ?? []}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
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
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default BookModalEdit;
