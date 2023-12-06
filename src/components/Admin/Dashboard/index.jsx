import { useEffect, useState } from 'react';
import { callFetchDashboard } from '../../../services/api';
import './Dashboard.scss';

import { Col, Row, Statistic, Card } from 'antd';
import CountUp from 'react-countup';

const Dashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
    });

    const fetchDashboard = async () => {
        const res = await callFetchDashboard();

        if (res && res.data) {
            setDataDashboard({
                countOrder: res.data.countOrder,
                countUser: res.data.countUser,
            });
        }
    };
    useEffect(() => {
        fetchDashboard();
    }, []);

    const formatter = (value) => <CountUp end={value} separator="," />;

    return (
        <div className="admin-dashboard">
            <Row gutter={[25, 25]}>
                <Col md={10}>
                    <Card title="" bordered={false}>
                        <Statistic title="Tổng Users" value={dataDashboard.countUser} formatter={formatter} />
                    </Card>
                </Col>
                <Col md={10}>
                    <Card title="" bordered={false}>
                        <Statistic title="Tổng Đơn Hàng" value={dataDashboard.countOrder} formatter={formatter} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
