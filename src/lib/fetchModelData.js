/**
 * fetchModel - Fetch dữ liệu từ Backend API
 * @param {string} url - URL endpoint (e.g., "/user/list", "/user")
 * @param {string} method - HTTP method (e.g., "GET", "POST") - mặc định là "GET"
 * @param {object|FormData} data - Dữ liệu gửi kèm (dùng cho POST) - mặc định là null
 * Nếu là FormData: gửi multipart/form-data (dùng cho upload file)
 * Nếu là object: gửi application/json
 * @returns {Promise} - Promise resolve với object chứa data hoặc lỗi
 */
function fetchModel(url, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    // 1. CẤU HÌNH ĐỊA CHỈ BACKEND TẠI ĐÂY
    const BASE_URL = "https://gn4nvs-8081.csb.app";
    const fullUrl = BASE_URL + url;

    // Cấu hình request options
    const options = {
      method: method,
      credentials: "include", // Gửi cookie session kèm theo mỗi request
    };

    // Nếu là POST/PUT/PATCH, thêm body chứa dữ liệu
    if (method !== "GET" && data) {
      if (data instanceof FormData) {
        // FormData: KHÔNG set Content-Type (browser tự thêm boundary)
        options.body = data;
      } else {
        // JSON thông thường
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(data);
      }
    } else if (method !== "GET") {
      // POST không có data (ví dụ logout)
      options.headers = { "Content-Type": "application/json" };
    }

    // Gửi request TỚI BACKEND (fullUrl) THAY VÌ FRONTEND (url)
    fetch(fullUrl, options)
      .then((response) => {
        // Kiểm tra nếu response không thành công
        if (!response.ok) {
          // 2. FIX LỖI STREAM: Chỉ đọc text 1 lần duy nhất
          return response.text().then((text) => {
            try {
              // Thử parse thành JSON xem server có trả về JSON không
              const errorData = JSON.parse(text);
              reject({
                status: response.status,
                statusText: response.statusText,
                message:
                  errorData.error || errorData.message || "Có lỗi xảy ra",
              });
            } catch (e) {
              // Nếu catch chạy, tức là server trả về HTML, dùng text thuần
              reject({
                status: response.status,
                statusText: response.statusText,
                message: text || "Có lỗi xảy ra khi gọi API",
              });
            }
          });
        }
        // Nếu thành công, parse JSON
        return response.json();
      })
      .then((data) => {
        // Trả về đúng cấu trúc { data: ... }
        if (data) {
          resolve({ data: data });
        }
      })
      .catch((error) => {
        // Xử lý lỗi kết nối mạng hoặc server sập
        reject({
          status: 500,
          message: error.message || "Network Error",
        });
      });
  });
}

export default fetchModel;
