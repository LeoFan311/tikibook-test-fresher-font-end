import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Modal, message, Upload, Table, notification } from 'antd';
const { Dragger } = Upload;
import * as XLSX from 'xlsx';
import './UserImport.scss';
import { callBulkCreateUser } from '../../../../services/api';
import templateFile from './template.xlsx?url';

const UserImport = (props) => {
    const [excelUser, SetExcelUser] = useState([]);
    const [showUploadFile, setShowUploadFile] = useState(false);
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess();
        }, 1000);
    };

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        customRequest: dummyRequest,
        onRemove: () => {
            SetExcelUser([]);
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = () => {
                        const data = new Uint8Array(reader.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const json = XLSX.utils.sheet_to_json(sheet, {
                            header: ['fullName', 'email', 'phone'],
                            range: 1,
                        });
                        const checkShowUploadFile = showUploadFile;
                        if (!checkShowUploadFile) {
                            setShowUploadFile(true);
                        }

                        SetExcelUser(json);
                    };
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleSubmit = async () => {
        const data = excelUser.map((item) => {
            item.password = '123456';
            return item;
        });

        console.log('>>> Check data: ', data);
        const res = await callBulkCreateUser(data);
        if (res.data) {
            notification.success({
                description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                message: 'Upload thành công',
            });
            SetExcelUser([]);
            setShowUploadList(false);
            props.onCancel();
            props.fetchUser();
        }
    };

    const columns = [
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true,
        },
    ];

    const renderTableHeader = () => {
        return <div className="upload-table-header">Danh sách người dùng</div>;
    };
    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={props.open}
                onCancel={() => {
                    SetExcelUser([]);
                    setShowUploadFile(false);
                    props.onCancel();
                }}
                onOk={() => handleSubmit()}
                okText={'Import data'}
                cancelText={'Cancel'}
                width={750}
                okButtonProps={{
                    disabled: excelUser.length < 1,
                }}
                maskClosable={false}
            >
                <Dragger {...propsUpload} showUploadList={showUploadFile}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload only. Only accept .csv, .xls, .xlsx file. Or
                        <a
                            onClick={(e) => e.stopPropagation()}
                            href={templateFile}
                            download
                            style={{ padding: '5px 5px' }}
                        >
                            Download sample file
                        </a>
                    </p>
                </Dragger>
                <div className="upload-users-table">
                    <Table
                        title={renderTableHeader}
                        dataSource={excelUser}
                        columns={columns}
                        // loading={tableIsLoading}
                        rowKey="_id"
                    />
                </div>
            </Modal>
        </>
    );
};

export default UserImport;
