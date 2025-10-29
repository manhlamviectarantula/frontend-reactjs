import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarAdmin from './sidebarAdmin';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Pagination } from '@mui/material';
import axios from 'axios';
import { store } from '../../redux/store';
import { toast, ToastContainer } from 'react-toastify';
import slugify from 'slugify';
import { formatDate, formatDatetime } from '../../lib/utils';
import { useSelector } from 'react-redux';

const ManageMovie = () => {
    const user = useSelector((state) => state.user.currentUser)
    const token = user.token

    const [movies, setMovies] = useState([]);
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

    // Pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(7);
    const [totalPages, setTotalPages] = useState(1);

    const addMovieClick = () => setShowAddModal(true);

    // Fetch movies with pagination & search
    const fetchMovies = async (pageNumber = 1, search = "") => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/movie/get-all-movie`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: pageNumber, limit, query: search }
            });
            const movieData = response.data.movies || [];
            setMovies(movieData);
            setPage(response.data.pagination?.page || 1);
            const total = response.data.pagination?.total || 0;
            setTotalPages(Math.ceil(total / limit));
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phim:', error);
        }
    };

    useEffect(() => { fetchMovies(1, searchTerm); }, [searchTerm]);

    useEffect(() => { fetchMovies(page, searchTerm); }, []);

    // Slug tự tạo
    useEffect(() => {
        setSlug(slugify(MovieName, { lower: true, strict: true, locale: 'vi' }));
    }, [MovieName]);

    useEffect(() => {
        setSelectedMovie(prev => ({
            ...prev,
            Slug: slugify(prev.MovieName, { lower: true, strict: true, locale: "vi" })
        }));
    }, [selectedMovie.MovieName]);

    // Add movie
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
            await axios.post(`${process.env.REACT_APP_API}/movie/add-movie`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });
            toast.success("Thêm phim thành công!");
            // reset form
            setMovieName(""); setSlug(""); setAgeTag(""); setDuration(""); setReleaseDate("");
            setLastScreenDate(""); setTrailer(""); setRating(""); setDescription("");
            setImageMovie(null); setPreviewImage(null);

            fetchMovies(1, searchTerm);
        } catch (error) {
            console.error("Error adding movie:", error);
            toast.error("Có lỗi xảy ra khi thêm phim.");
        }
    };

    // Edit movie
    const handleEditClick = (movie) => {
        setSelectedMovie(movie);
        setShowEditModal(true);
        setPreviewImage(null);
    };

    const handleUpdateMovie = async (e) => {
        e.preventDefault();
        if (!selectedMovie.MovieName || !selectedMovie.Slug || !selectedMovie.AgeTag || !selectedMovie.Duration || !selectedMovie.ReleaseDate || !selectedMovie.LastScreenDate || !selectedMovie.Trailer || !selectedMovie.Rating || !selectedMovie.Description || !isAdmin?.Email) {
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
        if (ImageMovie) formData.append("Poster", ImageMovie);
        formData.append("LastUpdatedBy", isAdmin.Email);

        try {
            await axios.put(`${process.env.REACT_APP_API}/movie/update-movie/${selectedMovie.MovieID}`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });
            toast.success("Cập nhật phim thành công!");
            setShowEditModal(false);
            fetchMovies(page, searchTerm);
        } catch (error) {
            console.error("Error updating movie:", error);
            toast.error(error.response?.data?.error || "Có lỗi xảy ra khi cập nhật phim.");
        }
    };

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
                                <Button variant='secondary' onClick={addMovieClick}>
                                    Thêm phim
                                </Button>
                            </div>
                        </div>

                        <TableContainer component={Paper} elevation={3}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#2c3034' }}>
                                        <TableCell sx={{ color: 'white' }}><b>ID</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Tên Phim</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Tuổi</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Trạng thái</b></TableCell>
                                        <TableCell sx={{ color: 'white' }}><b>Ngày khởi chiếu</b></TableCell>
                                        <TableCell sx={{ color: 'white' }} align="center"><b>Sửa</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {movies.length > 0 ? movies.map(movie => (
                                        <TableRow key={movie.MovieID} hover>
                                            <TableCell>{movie.MovieID}</TableCell>
                                            <TableCell>{movie.MovieName}</TableCell>
                                            <TableCell>{movie.AgeTag}</TableCell>
                                            <TableCell sx={{ color: movie.Status === 1 ? 'green' : movie.Status === 0 ? '#212529' : 'red' }}>
                                                {movie.Status === 1 ? 'Phim đang chiếu' : movie.Status === 0 ? 'Phim sắp chiếu' : 'Kết thúc chiếu'}
                                            </TableCell>
                                            <TableCell>{formatDate(movie.ReleaseDate)}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Sửa phim">
                                                    <IconButton color="primary" onClick={() => handleEditClick(movie)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">Không có phim nào.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <div className="d-flex justify-content-center mt-3">
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(e, value) => {
                                    setPage(value);
                                    fetchMovies(value, searchTerm);
                                }}
                                color="primary"
                            />
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Modal Add Movie */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Thêm phim</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddMovie} encType="multipart/form-data">
                        <Form.Group className="mb-3">
                            <Form.Label>Tên phim</Form.Label>
                            <Form.Control type="text" value={MovieName} onChange={e => setMovieName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Slug</Form.Label>
                            <Form.Control type="text" value={Slug} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tuổi được xem</Form.Label>
                            <Form.Select value={AgeTag} onChange={e => setAgeTag(e.target.value)}>
                                <option value="">--Chọn--</option>
                                <option value="18+">18+</option>
                                <option value="16+">16+</option>
                                <option value="13+">13+</option>
                                <option value="P">P</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thời lượng</Form.Label>
                            <Form.Control type="text" value={Duration} onChange={e => setDuration(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày khởi chiếu</Form.Label>
                            <Form.Control type="date" value={ReleaseDate} onChange={e => setReleaseDate(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày chiếu cuối (dự kiến)</Form.Label>
                            <Form.Control type="date" value={LastScreenDate} onChange={e => setLastScreenDate(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trailer nhúng</Form.Label>
                            <Form.Control type="text" value={Trailer} onChange={e => setTrailer(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control type="text" value={Rating} onChange={e => setRating(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Poster</Form.Label>
                            <div className="mb-2">
                                {previewImage && <Image src={previewImage} width="30%" rounded />}
                            </div>
                            <Form.Control type="file" accept="image/*" onChange={e => {
                                const file = e.target.files[0];
                                if (file) { setPreviewImage(URL.createObjectURL(file)); setImageMovie(file); }
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung phim</Form.Label>
                            <Form.Control as="textarea" rows={3} value={Description} onChange={e => setDescription(e.target.value)} />
                        </Form.Group>
                        <Button type="submit" variant="dark" className="w-100">Thêm phim</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal Edit Movie */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Sửa phim</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateMovie} encType="multipart/form-data">
                        <Form.Group className="mb-3">
                            <Form.Label>Tên phim</Form.Label>
                            <Form.Control type="text" value={selectedMovie?.MovieName || ''} onChange={e => setSelectedMovie(prev => ({ ...prev, MovieName: e.target.value }))} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Slug</Form.Label>
                            <Form.Control type="text" value={selectedMovie?.Slug || ''} readOnly required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tuổi được xem</Form.Label>
                            <Form.Select value={selectedMovie?.AgeTag || ''} onChange={e => setSelectedMovie(prev => ({ ...prev, AgeTag: e.target.value }))} required>
                                <option value="18+">18+</option>
                                <option value="16+">16+</option>
                                <option value="13+">13+</option>
                                <option value="P">P</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thời lượng</Form.Label>
                            <Form.Control type="text" value={selectedMovie?.Duration || ''} onChange={e => setSelectedMovie(prev => ({ ...prev, Duration: e.target.value }))} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày khởi chiếu</Form.Label>
                            <Form.Control type="date" value={selectedMovie?.ReleaseDate || ''} onChange={e => setSelectedMovie(prev => ({ ...prev, ReleaseDate: e.target.value }))} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày chiếu cuối (dự kiến)</Form.Label>
                            <Form.Control type="date" value={selectedMovie?.LastScreenDate || ''} onChange={e => setSelectedMovie(prev => ({ ...prev, LastScreenDate: e.target.value }))} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trailer</Form.Label>
                            <Form.Control type="text" value={selectedMovie?.Trailer || ''} onChange={e => setSelectedMovie(prev => ({ ...prev, Trailer: e.target.value }))} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control type="text" value={selectedMovie?.Rating || ''} onChange={e => setSelectedMovie(prev => ({ ...prev, Rating: e.target.value }))} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Poster</Form.Label>
                            <div className="mb-2">
                                {(previewImage || selectedMovie?.Poster) ? <Image src={previewImage || selectedMovie?.Poster} width="30%" rounded /> : <p>Chưa có hình ảnh</p>}
                            </div>
                            <Form.Control type="file" accept="image/*" onChange={e => {
                                const file = e.target.files[0];
                                if (file) { setPreviewImage(URL.createObjectURL(file)); setImageMovie(file); }
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung phim</Form.Label>
                            <Form.Control as="textarea" rows={3} value={selectedMovie?.Description || ''} onChange={e => setSelectedMovie(prev => ({ ...prev, Description: e.target.value }))} required />
                        </Form.Group>
                        <Button type="submit" variant="dark" className="w-100">Lưu thay đổi</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ManageMovie;
