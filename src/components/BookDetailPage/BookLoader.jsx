import { Col, Row, Skeleton } from 'antd';

const BookLoader = () => {
    return (
        <Row
            style={{
                width: '1250px',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: '#fff',
                padding: '15px',
            }}
        >
            <Col md={10} sm={24} xs={24}>
                <Skeleton.Input active={true} block={true} style={{ width: '100%', height: '350px' }} />

                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                    <Skeleton.Image active={true} style={{ marginRight: '5px' }} />
                    <Skeleton.Image active={true} style={{ marginRight: '5px' }} />
                    <Skeleton.Image active={true} style={{ marginRight: '5px' }} />
                </div>
            </Col>
            <Col md={14} sm={0} xs={0} className="padding-left-16-md">
                <Skeleton paragraph={{ rows: 3 }} active={true} />
                <Skeleton paragraph={{ rows: 2 }} active={true} style={{ marginTop: '52px', marginBottom: '52px' }} />
                <Skeleton.Button style={{ marginRight: '10px', width: '150px' }} />
                <Skeleton.Button style={{ marginRight: '10px', width: '150px' }} />
            </Col>
        </Row>
    );
};

export default BookLoader;
