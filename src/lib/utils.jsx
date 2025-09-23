const formatDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
};

const formatDatetime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

const getShowDates = (days) => {
  const result = [];
  const today = new Date();
  const weekdays = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    let weekday = weekdays[d.getDay()];
    if (i === 0) {
      weekday = "Hôm nay";
    }

    result.push({
      value: `${year}-${month}-${day}`, // query API
      label: `${day}/${month}`,         // hiển thị ngày
      weekday: weekday,                 // hiển thị thứ
    });
  }

  return result;
};

const formatShowtimeDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${parseInt(day, 10)}/${parseInt(month, 10)}`;
};

const formatCurrency = (value) => {
  if (value == null) return "0₫";
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const removeVietnameseTones = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Chuyển đ -> d
    .replace(/[^a-zA-Z0-9\s]/g, '') // Xóa ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-'); // Thay khoảng trắng bằng '-'
};

// Chuyển BranchName thành slug
const formatBranchSlug = (branch) => {
  return '-' + removeVietnameseTones(branch.toLowerCase()).replace(/\s+/g, '');
};

export {
  formatDate,
  formatDatetime,
  getShowDates,
  formatShowtimeDate,
  formatCurrency,
  removeVietnameseTones,
  formatBranchSlug
};
