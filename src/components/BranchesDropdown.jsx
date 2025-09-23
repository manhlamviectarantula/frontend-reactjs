import { useState } from "react";
import { Dropdown, DropdownButton, FormControl } from "react-bootstrap";

const BranchesDropdown = ({ branches, selectedBranch, setSelectedBranch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredbranches = branches.filter((m) =>
        m.BranchName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lấy tên phim từ ID đang chọn
    const selectedBranchName =
        branches.find((m) => m.BranchID === selectedBranch)?.BranchName || "Chọn chi nhánh";

    return (
        <DropdownButton
            title={selectedBranchName}
            variant="dark"
            onSelect={(eventKey) => setSelectedBranch(Number(eventKey))}
            className="branch-dropdown"
        >
            {/* Ô tìm kiếm */}
            <div className="px-3 py-2">
                <FormControl
                    autoFocus
                    placeholder="Tìm chi nhánh..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Danh sách phim */}
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {filteredbranches.length > 0 ? (
                    filteredbranches.map((branch) => (
                        <Dropdown.Item
                            key={branch.BranchID}
                            eventKey={branch.BranchID}
                        >
                            {branch.BranchName}
                        </Dropdown.Item>
                    ))
                ) : (
                    <Dropdown.Item disabled>Không tìm thấy chi nhánh</Dropdown.Item>
                )}
            </div>
        </DropdownButton>
    );
};

export default BranchesDropdown;