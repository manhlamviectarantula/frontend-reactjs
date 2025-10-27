import { useEffect, useState } from 'react';
import { Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import axios from 'axios';
import { formatCurrency } from '../lib/utils';
import { useSelector } from 'react-redux';

const pieColors = ['#ff6384', '#36a2eb', '#c422ff', '#4caf50', '#ff9800'];

const RevenueAndAgeChart = () => {
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [availableYears, setAvailableYears] = useState([2023, 2024, 2025]);

    const [pieData, setPieData] = useState([]);
    const [columnData, setColumnData] = useState([]);

    useEffect(() => {
        fetchColumnData(selectedYear);
    }, [selectedYear]);

    useEffect(() => {
        fetchPieData();
    }, []);

    const fetchColumnData = async (year) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-order-total-chart?year=${year}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setColumnData(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu:', err);
            setColumnData([]);
        }
    };

    const fetchPieData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-pie-chart`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPieData(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Lỗi khi tải pie chart:', err);
            setPieData([]);
        }
    };

    return (
        <Row className='shadow'>
            {/* Pie Chart */}
            <Col md={3} className='p-3 border-end border-secondary' style={{ background: '#f0f0f0' }}>
                <h4 className="text-center">Phim theo độ tuổi</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="Percentage"
                            nameKey="AgeTag"
                            cx="50%"
                            cy="50%"
                            outerRadius={50}
                            label={({ AgeTag, percent }) => `${AgeTag}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={pieColors[index % pieColors.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                </ResponsiveContainer>

                <ul className="list-unstyled text-center">
                    {pieData.map((item, index) => (
                        <li key={index}>
                            <span style={{ color: pieColors[index % pieColors.length] }}>●</span>{' '}
                            {`Phim ${item.AgeTag}`}: {item.Percentage}%
                        </li>
                    ))}
                </ul>
            </Col>

            {/* Bar Chart */}
            <Col md={9} className='p-3' style={{ background: '#f0f0f0' }}>
                <Row className="mb-3 align-items-center">
                    <Col><h4 className="mb-0">Doanh thu theo tháng</h4></Col>
                    <Col className="text-end">
                        <DropdownButton
                            variant="outline-dark"
                            title={`Năm ${selectedYear}`}
                            onSelect={(e) => setSelectedYear(Number(e))}
                        >
                            {(availableYears ?? []).map((year) => (
                                <Dropdown.Item key={year} eventKey={year}>{year}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Col>
                </Row>

                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={columnData} margin={{ top: 30, right: 10, left: 35, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Month" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="Total" fill="#DFCF91" />
                    </BarChart>
                </ResponsiveContainer>
            </Col>
        </Row>
    );
};

export default RevenueAndAgeChart;
