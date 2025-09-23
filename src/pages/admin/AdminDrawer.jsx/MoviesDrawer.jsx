import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from "dayjs";
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import MoviesDropdown from '../../../components/MoviesDropdown';
import { formatCurrency } from '../../../lib/utils';
import { useSelector } from 'react-redux';

export default function MoviesDrawer() {
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    const [movieDropdown, setMovieDropdown] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState("Chọn phim");
    const [overall, setOverall] = useState()

    const [dateRange, setDateRange] = useState([null, null]);
    const [fromDate, toDate] = dateRange; // destructuring để dùng lại

    const formattedFrom = fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : null;
    const formattedTo = toDate ? dayjs(toDate).format("YYYY-MM-DD") : null;

    const [chartData, setChartData] = useState([]);

    const fetchMovieDropdown = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-movie-dropdown`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMovieDropdown(res.data.movies || []);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu:', err);
            setMovieDropdown([]);
        }
    };

    const fetchOveral = async () => {
        if (!selectedMovie || !fromDate || !toDate) return;

        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-movie-overall?MovieID=${selectedMovie}&FromDate=${formattedFrom}&ToDate=${formattedTo}`,
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
        fetchMovieDropdown()
    }, [])

    useEffect(() => {
        if (selectedMovie !== "Chọn phim" && fromDate && toDate) {
            fetchOveral()
            fetchChartData()
        }
    }, [selectedMovie, fromDate, toDate])

    const fetchChartData = async () => {
        if (!selectedMovie || !fromDate || !toDate) return;

        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/adminDashboard/get-movie-chart?MovieID=${selectedMovie}&FromDate=${formattedFrom}&ToDate=${formattedTo}`,
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
                <MoviesDropdown
                    movies={movieDropdown}
                    selectedMovie={selectedMovie}
                    setSelectedMovie={setSelectedMovie}
                />
                {selectedMovie !== "Chọn phim" ?
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
                            <p>Biểu đồ thể hiện doanh thu từ ghế đã bán của một phim</p>
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
                                    <td className="text-end">{overall?.SoldSeats}</td>
                                </tr>
                                <tr>
                                    <td><trong>Doanh thu từ ghế</trong></td>
                                    <td className="text-end">{formatCurrency(overall?.TotalRevenue)}</td>
                                </tr>
                                <tr>
                                    <td><trong>Ngày bán ít nhất</trong></td>
                                    <td className="text-end">{dayjs(overall?.MinDay).format("DD/MM")} - {overall?.MinDaySeats} ghế - {formatCurrency(overall?.MinDayRevenue)}</td>
                                </tr>
                                <tr>
                                    <td><trong>Ngày bán nhiều nhất</trong></td>
                                    <td className="text-end">{dayjs(overall?.MaxDay).format("DD/MM")} - {overall?.MaxDaySeats} ghế - {formatCurrency(overall?.MaxDayRevenue)}</td>
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
                <div className='mt-5 text-center'>Vui lòng chọn phim và thời gian</div>
            )}
        </>
    );
}
