import { Col, Row, Rate } from 'antd';
import ImageGallery from 'react-image-gallery';
// import stylesheet if you're not already using CSS @import
import 'react-image-gallery/styles/scss/image-gallery.scss';
import './BookDetailPage.scss';
import ModalGallery from './ModalGallery';
import { useEffect, useRef, useState } from 'react';
import BookLoader from './BookLoader';
import { callFetchBookById } from '../../services/api';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { doAddBookAction } from '../../redux/order/orderSlide.js';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const BookDetailPage = () => {
    const dispatch = useDispatch();
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [bookData, setBookData] = useState({});
    const [currentQuantity, setCurrentQuantity] = useState(1);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get('id'); // book id

    useEffect(() => {
        fetchBook(id);
    }, [id]);

    const getImages = (raw) => {
        const images = [];
        if (raw.thumbnail) {
            images.push({
                original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                originalClass: 'original-image',
                thumbnailClass: 'thumbnail-image',
            });
        }

        if (raw.slider) {
            raw.slider?.map((item) => {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    originalClass: 'original-image',
                    thumbnailClass: 'thumbnail-image',
                });
            });
        }
        return images;
    };

    const fetchBook = async (id) => {
        const res = await callFetchBookById(id);
        if (res && res.data) {
            let raw = res.data;
            raw.items = getImages(raw);
            setBookData(raw);
            // setTimeout(() => {
            //     setBookData(raw);
            // }, 200);
        }
    };

    const handleOnThumbnailClick = (event, index) => {
        setIsOpenModalGallery(true);
        setCurrentIndex(index);
    };

    const refGallery = useRef(null);

    const handleSlideImageClick = (e) => {
        const check123 = refGallery?.current?.getCurrentIndex() ?? null;
        setIsOpenModalGallery(true);
        setCurrentIndex(check123);
    };

    const handleAddToCart = () => {
        dispatch(doAddBookAction({ quantity: +currentQuantity, detail: bookData, _id: bookData._id }));
    };

    const handleOnchangeButton = (type) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }

        if (type === 'PLUS') {
            if (currentQuantity + 1 >= +bookData.quantity) {
                setCurrentQuantity(+bookData.quantity);
            } else {
                setCurrentQuantity((prev) => prev + 1);
            }
        }
    };

    const handleQuantityOnchange = (value) => {
        if (!isNaN(value)) {
            if (+value >= bookData.quantity) {
                setCurrentQuantity(+bookData.quantity);
            }
            if (+value > 0 && +value < +bookData.quantity) {
                setCurrentQuantity(+value);
            }
        }
    };

    return bookData?.items ? (
        <Row
            gutter={[0, 25]}
            style={{
                width: '1250px',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: '#fff',
                padding: '15px',
            }}
        >
            <Col md={10} sm={24} xs={24}>
                {bookData?.items && (
                    <>
                        <ImageGallery
                            ref={refGallery}
                            slideDuration={0.1}
                            items={bookData.items}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            renderLeftNav={() => <></>}
                            renderRightNav={() => <></>}
                            slideOnThumbnailOver={() => true}
                            onThumbnailClick={(event, index) => handleOnThumbnailClick(event, index)}
                            onClick={(e) => handleSlideImageClick(e)}
                        />
                        <ModalGallery
                            isOpen={isOpenModalGallery}
                            setIs0pen={setIsOpenModalGallery}
                            currentIndex={currentIndex}
                            setCurrentIndex={setCurrentIndex}
                            items={bookData.items}
                            title={bookData.mainText}
                        />
                    </>
                )}
            </Col>
            <Col md={14} sm={24} xs={24}>
                <div style={{ height: '100%' }} className="book-info-detail padding-left-16-md">
                    <div style={{ opacity: 0.6, fontSize: '13px', marginBottom: '16px', marginTop: '24px' }}>
                        <span>Tác giả: </span>
                        <a>{bookData.author}</a>
                    </div>
                    <div className="_44qnta">
                        <span style={{ opacity: 0.8, fontSize: '24px' }}>{bookData.mainText}</span>
                    </div>
                    <div className="rating">
                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                        <span style={{ opacity: 0.5, fontSize: '12px' }}>| Đã bán {bookData.sold}</span>
                    </div>
                    <section style={{ marginBottom: '48px', alignItems: 'baseline' }}>
                        <div className='className="flex flex-column +o886E'>
                            <div className="flex items-center nmrSND">
                                <div className="flex items-center">
                                    <div className="pqTWkA">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(bookData.price)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div style={{ paddingLeft: '20px' }}>
                            <section className="flex items-center _6lioXX">
                                <h3 className="oN9nMU">Số lượng</h3>
                                <div className="flex items-center">
                                    <div style={{ marginRight: '15px' }}>
                                        <div className="ujMPZb shopee-input-quantity">
                                            <button
                                                aria-label="Decrease"
                                                className="xNxl-t"
                                                onClick={() => handleOnchangeButton('MINUS')}
                                            >
                                                <MinusOutlined />
                                            </button>
                                            <input
                                                className="xNxl-t VWjjde"
                                                type="text"
                                                role="spinbutton"
                                                aria-live="assertive"
                                                aria-valuenow="1"
                                                value={currentQuantity}
                                                onChange={(e) => handleQuantityOnchange(e.target.value)}
                                            />
                                            <span aria-live="polite" className="rqONlU"></span>
                                            <button
                                                aria-label="Increase"
                                                className="xNxl-t"
                                                onClick={() => handleOnchangeButton('PLUS')}
                                            >
                                                <PlusOutlined />
                                            </button>
                                        </div>
                                    </div>
                                    <div>{bookData.quantity} sản phẩm có sẵn</div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <div style={{ marginTop: '48px' }}>
                        <div className="ThEIyI">
                            <div className="p+UZsF">
                                <button
                                    type="button"
                                    className="btn btn-tinted btn--l iFo-rx QA-ylc"
                                    aria-disabled="false"
                                    onClick={() => handleAddToCart()}
                                >
                                    <span>Thêm vào giỏ hàng</span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-solid-primary btn--l iFo-rx"
                                    aria-disabled="false"
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    ) : (
        <BookLoader />
    );
};

export default BookDetailPage;
