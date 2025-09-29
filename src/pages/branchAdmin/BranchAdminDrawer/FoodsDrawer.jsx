import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../../../lib/utils";
import { Table } from "react-bootstrap";
import FoodsDropdown from "../../../components/FoodsDropdown";
import { useSelector } from "react-redux";

export default function FoodDrawer() {
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    const [foodDropdown, setFoodDropdown] = useState([]);
    const [selectedFood, setSelectedFood] = useState("Chọn món ăn");
    const [overall, setOverall] = useState()

    const [dateRange, setDateRange] = useState([null, null]);
    const [fromDate, toDate] = dateRange; // destructuring để dùng lại

    const formattedFrom = fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : null;
    const formattedTo = toDate ? dayjs(toDate).format("YYYY-MM-DD") : null;

    const [chartData, setChartData] = useState([]);

    const fetchFoodDropdown = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-food-dropdown/${user.user.BranchID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setFoodDropdown(res.data.foods || []);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu:', err);
            setFoodDropdown([]);
        }
    };

    const fetchOveral = async () => {
        if (!selectedFood || !fromDate || !toDate) return;

        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-food-overall/${user.BranchID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setOverall(res.data.data)
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu:', err);
            setOverall(null)
        }
    }

    useEffect(() => {
        fetchFoodDropdown()
    }, [])

    useEffect(() => {
        if (selectedFood !== "Chọn thức ăn" && fromDate && toDate) {
            fetchOveral()
            fetchChartData()
        }
    }, [selectedFood, fromDate, toDate])

    const fetchChartData = async () => {
        if (!selectedFood || !fromDate || !toDate) return;

        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-food-chart?FoodID=${selectedFood}&FromDate=${formattedFrom}&ToDate=${formattedTo}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setChartData(res.data.data || []);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu', err)
            setChartData([])
        }
    }

    return (
        <>
            <div className='d-flex justify-content-between'>
                <FoodsDropdown
                    foods={foodDropdown}
                    selectedFood={selectedFood}
                    setSelectedFood={setSelectedFood}
                />
                {selectedFood !== "Chọn món ăn" ?
                    <div className='d-flex align-items-center me-4'>
                        <DatePicker
                            selectsRange={true}
                            startDate={fromDate}
                            endDate={toDate}
                            onChange={(update) => setDateRange(update)}
                            isClearable={true}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn thời gian"
                            customInput={<input style={{ border: "1px solid black", width: "170px" }} />}
                            className="form-control"
                        />
                    </div>
                    :
                    <></>
                }
            </div>

            {fromDate && toDate ? (
                chartData.length > 0 ? (
                    <>
                        <div className='w-100 text-center mt-4 opacity-50'>
                            <p>Biểu đồ thể hiện doanh thu của một món ăn</p>
                        </div>
                        <ResponsiveContainer width="100%" height={460}>
                            <LineChart
                                data={chartData}
                                margin={{ top: 10, right: 25, left: 35, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="OrderDate" tickFormatter={d => dayjs(d).format("DD/MM")} />
                                <YAxis tickFormatter={formatCurrency} padding={{ bottom: 15 }} />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    labelFormatter={l => `Ngày: ${dayjs(l).format("DD/MM/YYYY")}`}
                                />
                                <Line type="linear" dataKey="TotalPrice" stroke="#4CAF50" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>

                        <div className='d-flex justify-content-center'>
                            <h6 className='mt-3'>Thông tin tổng thể</h6>
                        </div>
                        <Table bordered hover size="sm" style={{ fontSize: '0.95rem' }}>
                            <tbody>
                                <tr>
                                    <td><trong>Món bán chạy nhất</trong></td>
                                    <td className="text-end">{overall?.BestSellingName} - {overall?.BestSellingQty} phần</td>
                                </tr>
                                <tr>
                                    <td><trong>Món bán ít nhất</trong></td>
                                    <td className="text-end">{overall?.LeastSellingName} - {overall?.LeastSellingQty} phần</td>
                                </tr>
                                <tr>
                                    <td><trong>Món giá cao nhất</trong></td>
                                    <td className="text-end">{overall?.MostExpensiveName} - {formatCurrency(overall?.MostExpensivePrice)}</td>
                                </tr>
                                <tr>
                                    <td><trong>Món giá thấp nhất</trong></td>
                                    <td className="text-end">{overall?.CheapestName} - {formatCurrency(overall?.CheapestPrice)}</td>
                                </tr>
                                <tr>
                                    <td><trong>Tổng doanh thu từ thức ăn</trong></td>
                                    <td className="text-end">{formatCurrency(overall?.TotalRevenue)}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </>
                ) : (
                    <div className='mt-5 text-center'>Chưa có thống kê</div>
                )
            ) : (
                <div className='mt-5 text-center'>Vui lòng chọn món ăn và thời gian</div>
            )}
        </>
    );
}
