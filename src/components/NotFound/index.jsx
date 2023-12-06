import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    const handleBackToHome = () => {
        navigate('/');
    };
    return (
        <Result
            style={{ marginTop: '100px' }}
            status="404"
            title="404 not found"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary" onClick={() => handleBackToHome()}>
                    Back Home
                </Button>
            }
        />
    );
};

export default NotFound;
