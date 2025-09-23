import { useState } from "react";
import { Dropdown, DropdownButton, FormControl } from "react-bootstrap";

const MoviesDropdown = ({ movies, selectedMovie, setSelectedMovie }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMovies = movies.filter((m) =>
        m.MovieName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lấy tên phim từ ID đang chọn
    const selectedMovieName =
        movies.find((m) => m.MovieID === selectedMovie)?.MovieName || "Chọn phim";

    return (
        <DropdownButton
            title={selectedMovieName}
            variant="dark"
            onSelect={(eventKey) => setSelectedMovie(Number(eventKey))}
            className="movie-dropdown"
        >
            {/* Ô tìm kiếm */}
            <div className="px-3 py-2">
                <FormControl
                    autoFocus
                    placeholder="Tìm phim..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Danh sách phim */}
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <Dropdown.Item
                            key={movie.MovieID}
                            eventKey={movie.MovieID}
                        >
                            {movie.MovieName}
                        </Dropdown.Item>
                    ))
                ) : (
                    <Dropdown.Item disabled>Không tìm thấy phim</Dropdown.Item>
                )}
            </div>
        </DropdownButton>
    );
};

export default MoviesDropdown;
