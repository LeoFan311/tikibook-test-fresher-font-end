import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Spin, Pagination } from 'antd';
import { FilterTwoTone, ReloadOutlined, DollarOutlined } from '@ant-design/icons';
import './home.scss';
import { useEffect, useState } from 'react';
import { callBookCategory, callFetchListBook } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { convertSlug } from '../LanguageHandle/convertSlug';
import Header from '../Header';
const HomePage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [listCategory, setListCategory] = useState([]);

    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState('');
    const [tableSortQuery, setTableSortQuery] = useState('sort=-sold');
    const [tableIsLoading, setTableIsLoading] = useState(false);

    useEffect(() => {
        const initCategory = async () => {
            const res = await callBookCategory();
            if (res && res.data) {
                const d = res.data.map((item) => {
                    return {
                        label: item,
                        value: item,
                    };
                });
                setListCategory(d);
            }
        };
        initCategory();
    }, []);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, tableSortQuery]);

    const fetchBook = async () => {
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += filter;
        }
        if (tableSortQuery) {
            query += `&${tableSortQuery}`;
        }
        const res = await callFetchListBook(query);
        setTableIsLoading(true);
        if (res?.data?.result && res.data.result.length > 0) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
            setTableIsLoading(false);
        }
    };

    const handleChangeFilter = (changedValues, values) => {
        // if (changedValues.category) {
        //     const cate = values.category;
        //     if (cate && cate.length > 0) {
        //         const f = cate.join(',');
        //         setFilter(`&category=${f}`);
        //     } else {
        //         setFilter('');
        //     }
        // }
    };

    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const onFinish = (values) => {
        let f = '';
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            f += `&price>=${values?.range?.from} &price<=${values?.range?.to}`;
        }

        if (values?.category?.length) {
            const cate = values?.category?.join(',');
            f += `&category=${cate}`;
        }
        if (f) {
            setFilter(f);
        } else {
            setFilter('');
        }
    };
    const items = [
        {
            key: 'sort=-sold',
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: 'sort=-updatedAt',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: 'sort=price',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];

    const handleRedirectBook = (book) => {
        const slug = convertSlug(book.mainText);
        navigate(`/book/${slug}?id=${book._id}`);
    };

    return (
        <div
            className="homepage-container"
            style={{ width: '1250px', maxWidth: 'calc(100% - 32px)', margin: '0 auto' }}
        >
            <Row gutter={[0, 0]}>
                <Col md={4} sm={0} xs={0}>
                    <div className="home-left">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                                {' '}
                                <FilterTwoTone /> Bộ lọc tìm kiếm
                            </span>
                            <ReloadOutlined
                                title="Reset"
                                onClick={() => {
                                    form.resetFields();
                                    setFilter('');
                                }}
                            />
                        </div>
                        <Divider />

                        <Form
                            onFinish={onFinish}
                            form={form}
                            onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                        >
                            <Form.Item name="category" label="Danh mục sản phẩm" labelCol={{ span: 24 }}>
                                <Checkbox.Group>
                                    <Row>
                                        {listCategory &&
                                            listCategory.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
                                                        <Checkbox value={item.value}>{item.label}</Checkbox>
                                                    </Col>
                                                );
                                            })}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            {/* <Divider /> */}
                            <Form.Item
                                label={
                                    <div>
                                        <DollarOutlined />
                                        <span> Khoảng giá</span>
                                    </div>
                                }
                                labelCol={{ span: 24 }}
                            >
                                <Form.Item name={['range', 'from']}>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        name="from"
                                        min={0}
                                        placeholder="đ TỪ"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                                <Form.Item name={['range', 'to']}>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        name="to"
                                        min={0}
                                        placeholder="đ ĐẾN"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                                {/* </div> */}
                                <div>
                                    <Button onClick={() => form.submit()} style={{ width: '100%' }} type="primary">
                                        Áp dụng
                                    </Button>
                                </div>
                            </Form.Item>
                            <Divider />
                            <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                                <div>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text"></span>
                                </div>
                                <div>
                                    <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col md={20} xs={24} style={{ paddingLeft: '15px' }}>
                    <div className="home-right">
                        <Spin spinning={tableIsLoading} tip="Loading...">
                            <Row>
                                <Tabs
                                    defaultActiveKey="sort=-sold"
                                    items={items}
                                    onChange={(value) => {
                                        setTableSortQuery(value);
                                    }}
                                    style={{ overflowX: 'auto' }}
                                />
                            </Row>
                            <Row className="customize-row">
                                {listBook?.map((item, index) => {
                                    return (
                                        <div
                                            className="column"
                                            key={`book-${index}`}
                                            onClick={() => handleRedirectBook(item)}
                                        >
                                            <div className="wrapper" style={{ height: '100%' }}>
                                                <div className="thumbnail">
                                                    <img
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                                                            item.thumbnail
                                                        }`}
                                                        alt={item.mainText}
                                                    />
                                                </div>
                                                <div className="text">{item.mainText}</div>
                                                <div className="price">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(item.price)}
                                                </div>
                                                <div className="rating">
                                                    <Rate
                                                        value={5}
                                                        disabled
                                                        style={{ color: '#ffce3d', fontSize: 10 }}
                                                    />
                                                    <span>{item.sold}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Row>
                            <Divider />
                            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                                />
                            </Row>
                        </Spin>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default HomePage;
