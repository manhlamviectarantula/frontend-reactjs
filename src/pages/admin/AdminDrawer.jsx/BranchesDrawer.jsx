import DatePicker from "react-datepicker";
import BranchesDropdown from "../../../components/BranchesDropdown";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../../../lib/utils";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function BranchesDrawer() {
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    const [branchDropdown, setBranchDropdown] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("Chọn chi nhánh");
    const [overall, setOverall] = useState()

    const [dateRange, setDateRange] = useState([null, null]);
    const [fromDate, toDate] = dateRange; // destructuring để dùng lại

    const formattedFrom = fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : null;
    const formattedTo = toDate ? dayjs(toDate).format("YYYY-MM-DD") : null;

    const [chartData, setChartData] = useState([]);

    const fetchBranchDropdown = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-branch-dropdown`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setBranchDropdown(res.data.branches || []);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu:', err);
            setBranchDropdown([]);
        }
    };

    const fetchOveral = async () => {
        if (!selectedBranch || !fromDate || !toDate) return;

        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-branch-overall?BranchID=${selectedBranch}&FromDate=${formattedFrom}&ToDate=${formattedTo}`,
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
        fetchBranchDropdown()
    }, [])

    useEffect(() => {
        if (selectedBranch !== "Chọn chi nhánh" && fromDate && toDate) {
            fetchOveral()
            fetchChartData()
        }
    }, [selectedBranch, fromDate, toDate])

    const fetchChartData = async () => {
        if (!selectedBranch || !fromDate || !toDate) return;

        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-branch-chart?BranchID=${selectedBranch}&FromDate=${formattedFrom}&ToDate=${formattedTo}`,
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
                <BranchesDropdown
                    branches={branchDropdown}
                    selectedBranch={selectedBranch}
                    setSelectedBranch={setSelectedBranch}
                />
                {selectedBranch !== "Chọn chi nhánh" ?
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
                            <p>Biểu đồ thể hiện doanh thu từ ghế đã bán của một chi nhánh</p>
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
                                <Line type="linear" dataKey="TotalTicketPrice" stroke="#4CAF50" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>

                        <div className='d-flex justify-content-center'>
                            <h6 className='mt-3'>Thông tin tổng thể</h6>
                        </div>
                        <Table bordered hover size="sm" style={{ fontSize: '0.95rem' }}>
                            <tbody>
                                <tr>
                                    <td><trong>Ghế đã bán</trong></td>
                                    <td className="text-end">{overall?.TotalSeats}</td>
                                </tr>
                                <tr>
                                    <td><trong>Doanh thu từ ghế</trong></td>
                                    <td className="text-end">{formatCurrency(overall?.TotalRevenue)}</td>
                                </tr>
                                <tr>
                                    <td><trong>Ngày bán ít nhất</trong></td>
                                    <td className="text-end">{dayjs(overall?.MinSaleDate).format("DD/MM")} - {overall?.MinSaleSeats} ghế - {formatCurrency(overall?.MinSaleRevenue)}</td>
                                </tr>
                                <tr>
                                    <td><trong>Ngày bán nhiều nhất</trong></td>
                                    <td className="text-end">{dayjs(overall?.MaxSaleDate).format("DD/MM")} - {overall?.MaxSaleSeats} ghế - {formatCurrency(overall?.MaxSaleRevenue)}</td>
                                </tr>
                                <tr>
                                    <td><trong>Tổng suất chiếu</trong></td>
                                    <td className="text-end">{overall?.TotalShowtimes}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </>
                ) : (
                    <div className='mt-5 text-center'>Chưa có thống kê</div>
                )
            ) : (
                <div className='mt-5 text-center'>Vui lòng chọn chi nhánh và thời gian</div>
            )}
        </>
    );
}
