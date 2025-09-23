import { useState } from "react";
import { Dropdown, DropdownButton, FormControl } from "react-bootstrap";

const FoodsDropdown = ({ foods, selectedFood, setSelectedFood }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredfoods = foods.filter((m) =>
        m.FoodName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lấy tên phim từ ID đang chọn
    const selectedFoodName =
        foods.find((m) => m.FoodID === selectedFood)?.FoodName || "Chọn món ăn";

    return (
        <DropdownButton
            title={selectedFoodName}
            variant="dark"
            onSelect={(eventKey) => setSelectedFood(Number(eventKey))}
            className="food-dropdown"
        >
            {/* Ô tìm kiếm */}
            <div className="px-3 py-2">
                <FormControl
                    autoFocus
                    placeholder="Tìm thức ăn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Danh sách món ăn */}
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {filteredfoods.length > 0 ? (
                    filteredfoods.map((food) => (
                        <Dropdown.Item
                            key={food.FoodID}
                            eventKey={food.FoodID}
                        >
                            {food.FoodName}
                        </Dropdown.Item>
                    ))
                ) : (
                    <Dropdown.Item disabled>Không tìm thấy món ăn</Dropdown.Item>
                )}
            </div>
        </DropdownButton>
    );
};

export default FoodsDropdown;