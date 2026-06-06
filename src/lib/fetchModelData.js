/**
 * fetchModel - Fetch dữ liệu từ Backend API
 * @param {string} url - URL endpoint (e.g., "/user/list", "/user")
 * @param {string} method - HTTP method (e.g., "GET", "POST") - mặc định là "GET"
 * @param {object|FormData} data - Dữ liệu gửi kèm (dùng cho POST) - mặc định là null
 *   Nếu là FormData: gửi multipart/form-data (dùng cho upload file)
 *   Nếu là object: gửi application/json
 * @returns {Promise} - Promise resolve với object chứa data hoặc lỗi
 */
function fetchModel(url, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
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

    // Gửi request
    fetch(url, options)
      .then((response) => {
        // Kiểm tra nếu response không thành công
        if (!response.ok) {
          // Đọc thông báo lỗi từ server
          return response.json().then((errorData) => {
            reject({
              status: response.status,
              statusText: response.statusText,
              message: errorData.error || errorData.message || "Có lỗi xảy ra",
            });
          }).catch(() => {
            // Nếu response không phải JSON, đọc text
            return response.text().then((errorText) => {
              reject({
                status: response.status,
                statusText: response.statusText,
                message: errorText || "Có lỗi xảy ra khi gọi API",
              });
            });
          });
        }
        // Nếu thành công, parse JSON
        return response.json();
      })
      .then((data) => {
        // Trả về đúng cấu trúc { data: ... }
        resolve({ data: data });
      })
      .catch((error) => {
        // Xử lý lỗi kết nối mạng
        reject({
          status: 500,
          message: error.message || "Network Error",
        });
      });
  });
}

export default fetchModel;