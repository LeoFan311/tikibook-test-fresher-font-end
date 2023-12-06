import HashLoader from 'react-spinners/HashLoader';

const Loading = () => {
    return (
        <div
            style={{ height: '100vh', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <div style={{ marginTop: '-15vh' }}>
                <HashLoader color="#36d7b7" size={100} />
            </div>
        </div>
    );
};

export default Loading;
