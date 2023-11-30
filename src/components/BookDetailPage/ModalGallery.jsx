import { Modal, Row, Col, Image } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ImageGallery from 'react-image-gallery';
// import stylesheet if you're not already using CSS @import
import 'react-image-gallery/styles/scss/image-gallery.scss';

const ModalGallery = (props) => {
    const handleGetCurrentIdex = (onSlideIndex) => {
        props.setCurrentIndex(onSlideIndex);
    };
    const refGallery = useRef(null);

    return (
        <Modal
            open={props.isOpen}
            onCancel={() => {
                props.setIs0pen(false);
            }}
            footer={() => <></>}
            closeIcon={() => <></>}
            width={'70vw'}
        >
            <Row gutter={[0, 30]}>
                <Col md={15} sm={24}>
                    <ImageGallery
                        ref={refGallery}
                        slideDuration={1}
                        startIndex={props.currentIndex}
                        onSlide={(onSlideIndex) => handleGetCurrentIdex(onSlideIndex)}
                        items={props.items}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        slideOnThumbnailOver={() => true}
                        showThumbnails={false}
                    />
                </Col>
                <Col md={9} sm={24} className="padding-left-16-md">
                    <div style={{ marginBottom: '16px', fontSize: '20px' }}>{props.title}</div>
                    <Row gutter={[10, 10]}>
                        {props?.items?.map((item, index) => {
                            return (
                                <Col md={8} sm={8} key={index} style={{ cursor: 'pointer' }}>
                                    <Image
                                        src={item.thumbnail}
                                        style={{
                                            width: '100%',
                                            border: props.currentIndex === index ? '2px solid red' : '',
                                        }}
                                        preview={false}
                                        onClick={() => props.setCurrentIndex(index)}
                                    />
                                </Col>
                            );
                        })}
                    </Row>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalGallery;
