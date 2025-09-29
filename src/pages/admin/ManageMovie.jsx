import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarAdmin from './sidebarAdmin';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import { store } from '../../redux/store';
import { toast, ToastContainer } from 'react-toastify';
import slugify from 'slugify';
import { formatDate } from '../../lib/utils';
import { useSelector } from 'react-redux';

const ManageMovie = () => {
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [MovieName, setMovieName] = useState("");
    const [Slug, setSlug] = useState("")
    const [AgeTag, setAgeTag] = useState("")
    const [Duration, setDuration] = useState("")
    const [ReleaseDate, setReleaseDate] = useState("")
    const [LastScreenDate, setLastScreenDate] = useState("")
    const [Trailer, setTrailer] = useState("")
    const [Rating, setRating] = useState("")
    const [Description, setDescription] = useState("")
    const [ImageMovie, setImageMovie] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const isAdmin = store.getState().user.currentUser?.user;

    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const [selectedMovie, setSelectedMovie] = useState({ MovieName: "", Slug: "" });

    const addMovieClick = () => {
        setShowAddModal(true);
    }

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/movie/get-all-movie`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const movieData = response.data.movies || [];
                setMovies(movieData);
                setFilteredMovies(movieData);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách phim:', error);
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            const lowerCaseSearch = searchTerm.toLowerCase().trim();
            let filtered = movies.filter(movie =>
                movie.MovieName.toLowerCase().includes(lowerCaseSearch) ||
                movie.AgeTag.toLowerCase().includes(lowerCaseSearch)
            );

            if (lowerCaseSearch.includes("phim đang chiếu")) {
                filtered = movies.filter(movie => movie.Status === 1);
            } else if (lowerCaseSearch.includes("phim sắp chiếu")) {
                filtered = movies.filter(movie => movie.Status !== 1);
            }

            setFilteredMovies(filtered);
        } else {
            setFilteredMovies(movies);
        }
    }, [searchTerm, movies]);

    useEffect(() => {
        setSlug(slugify(MovieName, { lower: true, strict: true, locale: 'vi' }));
    }, [MovieName]);

    useEffect(() => {
        setSelectedMovie(prev => ({
            ...prev,
            Slug: slugify(prev.MovieName, { lower: true, strict: true, locale: "vi" })
        }));
    }, [selectedMovie.MovieName]);

    const handleAddMovie = async (e) => {
        e.preventDefault();

        if (!MovieName || !Slug || !AgeTag || !Duration || !ReleaseDate || !LastScreenDate || !Trailer || !Rating || !Description || !ImageMovie || !isAdmin?.Email) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setShowAddModal(false);

        const formData = new FormData();
        formData.append("MovieName", MovieName);
        formData.append("Slug", Slug);
        formData.append("AgeTag", AgeTag);
        formData.append("Duration", Duration);
        formData.append("ReleaseDate", ReleaseDate);
        formData.append("LastScreenDate", LastScreenDate);
        formData.append("Trailer", Trailer);
        formData.append("Rating", Rating);
        formData.append("Description", Description);
        formData.append("Poster", ImageMovie);
        formData.append("CreatedBy", isAdmin.Email);
        formData.append("LastUpdatedBy", isAdmin.Email);

        try {
            await axios.post(
                `${process.env.REACT_APP_API}/movie/add-movie`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            toast.success("Thêm phim thành công!");

            // Đặt lại giá trị của state về rỗng
            setMovieName("");
            setSlug("");
            setAgeTag("");
            setDuration("");
            setReleaseDate("");
            setLastScreenDate("");
            setTrailer("");
            setRating("");
            setDescription("");
            setImageMovie(null);
            setPreviewImage(null);

            // Cập nhật danh sách chi nhánh
            const response = await axios.get(`${process.env.REACT_APP_API}/movie/get-all-movie`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const movieData = response.data.movies || [];
            setMovies(movieData);
            setFilteredMovies(movieData);
        } catch (error) {
            console.error("Error adding branch:", error);
            toast.error("Có lỗi xảy ra khi thêm phim.");
        }
    }

    const handleEditClick = (movie) => {
        setSelectedMovie(movie);
        setShowEditModal(true);
    };

    const handleUpdateMovie = async (e) => {
        e.preventDefault();

        console.log(selectedMovie)

        if (!selectedMovie.MovieName || !selectedMovie.Slug || !selectedMovie.AgeTag || !selectedMovie.Duration || !selectedMovie.ReleaseDate || !selectedMovie.LastScreenDate || !selectedMovie.Trailer || !selectedMovie.Rating || !selectedMovie.Description || !selectedMovie.Poster || !isAdmin?.Email) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const formData = new FormData();
        formData.append("MovieName", selectedMovie.MovieName);
        formData.append("Slug", selectedMovie.Slug);
        formData.append("Status", selectedMovie.Status);
        formData.append("AgeTag", selectedMovie.AgeTag);
        formData.append("Duration", selectedMovie.Duration);
        formData.append("ReleaseDate", selectedMovie.ReleaseDate);
        formData.append("LastScreenDate", selectedMovie.LastScreenDate);
        formData.append("Trailer", selectedMovie.Trailer);
        formData.append("Rating", selectedMovie.Rating);
        formData.append("Description", selectedMovie.Description);
        formData.append("Poster", selectedMovie.ImageMovie);
        formData.append("LastUpdatedBy", isAdmin.Email);

        if (ImageMovie) {
            formData.append("Poster", ImageMovie);
        }

        if (!isAdmin?.Email) {
            toast.error("Không thể xác định người cập nhật!");
            return;
        }
        formData.append("LastUpdatedBy", isAdmin.Email);

        try {
            await axios.put(
                `${process.env.REACT_APP_API}/movie/update-movie/${selectedMovie.MovieID}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            toast.success("Cập nhật phim thành công!");
            setShowEditModal(false);

            const response = await axios.get(
                `${process.env.REACT_APP_API}/movie/get-all-movie`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const movieData = response.data.movies || [];
            setMovies(movieData);
            setFilteredMovies(movieData);

        } catch (error) {
            console.error("Error updating movie:", error);
            toast.error(error.response?.data?.error || "Có lỗi xảy ra khi cập nhật phim.");
        }

    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarAdmin} />
                    <Col md={10} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4>Danh sách phim</h4>
                            <div className='d-flex align-items-center gap-4'>
                                <TextField
                                    label="Tìm kiếm..."
                                    type="search"
                                    variant="standard"
                                    sx={{ width: '300px' }}
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant='secondary'
                                    onClick={addMovieClick}>
                                    Thêm phim
                                </Button>
                            </div>
                        </div>
                        <TableContainer component={Paper} elevation={3}>
                            <Table size="small" aria-label="Danh sách phim" sx={{ borderCollapse: 'collapse' }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#2c3034' }}>
                                        <TableCell sx={{ color: 'white' }}><b>ID</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Tên Phim</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Tuổi được xem</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Trạng thái</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Ngày khởi chiếu</b></TableCell>
                                        <TableCell sx={{ color: 'white' }} align="center"><b>Sửa</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredMovies.length > 0 ? (
                                        filteredMovies.map(movie => (
                                            <TableRow key={movie.MovieID} hover>
                                                <TableCell>{movie.MovieID}</TableCell>
                                                <TableCell>{movie.MovieName}</TableCell>
                                                <TableCell>{movie.AgeTag}</TableCell>
                                                <TableCell
                                                    sx={{
                                                        color:
                                                            movie.Status === 1
                                                                ? 'green'       // đang chiếu
                                                                : movie.Status === 0
                                                                    ? '#212529'     // sắp chiếu
                                                                    : 'red',        // kết thúc công chiếu
                                                    }}
                                                >
                                                    {movie.Status === 1
                                                        ? 'Phim đang chiếu'
                                                        : movie.Status === 0
                                                            ? 'Phim sắp chiếu'
                                                            : 'Kết thúc công chiếu'}
                                                </TableCell>
                                                <TableCell>{formatDate(movie.ReleaseDate)}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Sửa phim">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleEditClick(movie)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                Không có phim nào được tìm thấy.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Col>
                </Row>
            </Container>

            {/* Modal Add Movie */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập thông tin phim</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddMovie} encType="multipart/form-data">
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tên phim:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='MovieName'
                                value={MovieName}
                                onChange={(e) => setMovieName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Mã định danh:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="Slug"
                                value={Slug}
                                readOnly // Không cho sửa slug
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tuổi được xem:</strong></Form.Label>
                            <Form.Select
                                name="AgeTag"
                                value={AgeTag}
                                onChange={(e) => setAgeTag(e.target.value)}
                            >
                                <option value="">-- Chọn loại tuổi --</option>
                                <option value="18+">18+</option>
                                <option value="16+">16+</option>
                                <option value="13+">13+</option>
                                <option value="P">P</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Thời lượng (phút):</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='Duration'
                                value={Duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ngày khởi chiếu:</Form.Label>
                            <Form.Control
                                type="date"
                                name="ReleaseDate"
                                value={ReleaseDate}
                                onChange={(e) => setReleaseDate(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ngày chiếu cuối cùng (dự kiến):</Form.Label>
                            <Form.Control
                                type="date"
                                name="LastScreenDate"
                                value={LastScreenDate}
                                onChange={(e) => setLastScreenDate(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Trailer nhúng:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='Trailer'
                                value={Trailer}
                                onChange={(e) => setTrailer(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Điểm đánh giá:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='Rating'
                                value={Rating}
                                onChange={(e) => setRating(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Poster:</strong></Form.Label>
                            <div className="mb-2">
                                {previewImage && (
                                    <Image
                                        src={previewImage}
                                        width="30%"
                                        alt="Ảnh xem trước"
                                        rounded
                                    />
                                )}
                            </div>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                name='Image'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const imageUrl = URL.createObjectURL(file);
                                        setPreviewImage(imageUrl);
                                        setImageMovie(file)
                                    }
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tóm tắt phim:</strong></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name='Description'
                                value={Description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        {/* Khi bấm nút này sẽ mở modal xác nhận */}
                        <Button type="submit" variant="dark" className="w-100">
                            Thêm phim
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal Update Movie */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa thông tin phim</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateMovie} encType="multipart/form-data">
                        {/* Nhập tên thức ăn */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tên phim:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedMovie?.MovieName || ''}
                                onChange={(e) => setSelectedMovie(prev => ({ ...prev, MovieName: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Mã định danh:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedMovie?.Slug || ''}
                                readOnly
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tuổi được xem:</strong></Form.Label>
                            <Form.Select
                                value={selectedMovie?.AgeTag || ''}
                                onChange={(e) => setSelectedMovie(prev => ({ ...prev, AgeTag: e.target.value }))}
                                required
                            >
                                <option value="18+">18+</option>
                                <option value="16+">16+</option>
                                <option value="13+">13+</option>
                                <option value="P">P</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Thời lượng (phút):</strong></Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedMovie?.Duration || ''}
                                onChange={(e) => setSelectedMovie(prev => ({ ...prev, Duration: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Ngày khởi chiếu:</strong></Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedMovie?.ReleaseDate || ''}
                                onChange={(e) => setSelectedMovie(prev => ({ ...prev, ReleaseDate: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Ngày chiếu cuối cùng:</strong></Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedMovie?.LastScreenDate || ''}
                                onChange={(e) => setSelectedMovie(prev => ({ ...prev, LastScreenDate: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Trailer nhúng:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedMovie?.Trailer || ''}
                                onChange={(e) => setSelectedMovie(prev => ({ ...prev, Trailer: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Điểm đánh giá:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedMovie?.Rating || ''}
                                onChange={(e) => setSelectedMovie(prev => ({ ...prev, Rating: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        {/* Chọn hình ảnh */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Poster:</strong></Form.Label>
                            <div className="mb-2">
                                {previewImage || selectedMovie?.Poster ? (
                                    <Image
                                        src={previewImage || `${selectedMovie?.Poster}`}
                                        width="30%"
                                        alt="Ảnh xem trước"
                                        rounded
                                    />
                                ) : (
                                    <p>Chưa có hình ảnh</p>
                                )}
                            </div>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setPreviewImage(URL.createObjectURL(file)); // Xem trước ảnh mới
                                        setImageMovie(file); // Lưu file ảnh để gửi lên API
                                    }
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tóm tắt phim:</strong></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={selectedMovie?.Description || ''}
                                onChange={(e) => setSelectedMovie(prev => ({ ...prev, Description: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Người sửa cuối :</strong></Form.Label>
                            <Form.Control
                                as="text"
                                value={selectedMovie?.LastUpdatedBy || ''}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Lần sửa cuối:</strong></Form.Label>
                            <Form.Control
                                as="text"
                                value={selectedMovie?.LastUpdatedAt || ''}
                                readOnly
                            />
                        </Form.Group>

                        {/* Nút Lưu thay đổi */}
                        <Button type="submit" variant="dark" className="w-100">
                            Lưu thay đổi
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />

        </div>
    );
};

export default ManageMovie;
