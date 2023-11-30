import { Divider } from 'antd';
import { memo } from 'react';

const Footer = () => {
    console.log('Check footer render');
    return (
        <>
            <div style={{ textAlign: 'center', padding: '25px', backgroundColor: '#fff', marginTop: '15px' }}>
                --- Footer ---
            </div>
        </>
    );
};

export default memo(Footer);
