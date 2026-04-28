# BÁO CÁO ĐỀ TÀI
## Hệ thống kiểm duyệt ảnh tự động sử dụng Cloud Vision API

**MỤC LỤC**
*(Học viên sử dụng chức năng đánh số và mục lục tự động trong Word)*

**CHƯƠNG 1: GIỚI THIỆU**
**1.1. Lý do chọn đề tài**
Với sự phát triển mạnh mẽ của các nền tảng trực tuyến, mạng xã hội và các ứng dụng nhắn tin, lượng dữ liệu hình ảnh được người dùng tải lên hàng ngày là khổng lồ. Đi kèm với đó là nguy cơ xuất hiện các nội dung vi phạm tiêu chuẩn cộng đồng (như hình ảnh bạo lực, nhạy cảm, nội dung rác). Việc kiểm duyệt thủ công tốn rất nhiều thời gian, công sức và không thể đáp ứng được tốc độ phát triển của dữ liệu. Do đó, một hệ thống kiểm duyệt tự động, nhanh chóng và chính xác là một yêu cầu cấp thiết để bảo vệ môi trường trực tuyến an toàn.

**1.2. Mục tiêu đề tài**
- Xây dựng hệ thống tự động kiểm duyệt hình ảnh tải lên (đặc biệt là ảnh đại diện/avatar) bằng trí tuệ nhân tạo.
- Tự động phát hiện và phân loại các nội dung vi phạm tiêu chuẩn (nhạy cảm, bạo lực...).
- Tích hợp xử lý thời gian thực (real-time) để đảm bảo trải nghiệm người dùng không bị gián đoạn.

**1.3. Phạm vi đề tài**
- Hệ thống chỉ tập trung vào việc phân tích và kiểm duyệt hình ảnh tĩnh (không bao gồm video hay âm thanh).
- Sử dụng các dịch vụ có sẵn của nền tảng Google Cloud (Cloud Storage, Cloud Vision API, Pub/Sub, Cloud Function) thay vì tự xây dựng và huấn luyện mô hình AI riêng, giúp tối ưu thời gian triển khai và chi phí.
- Ứng dụng Backend xử lý nghiệp vụ được viết bằng Java Spring Boot và Frontend bằng React.

**1.4. Phương pháp thực hiện**
- Sử dụng Google Cloud Vision API với tính năng SafeSearch Detection để phát hiện các yếu tố vi phạm.
- Xây dựng hệ thống dựa trên kiến trúc hướng sự kiện (Event-driven Architecture).
- Xử lý các tác vụ bất đồng bộ thông qua dịch vụ nhắn tin Pub/Sub, giúp tách biệt các service và tăng cường khả năng mở rộng.

---

**CHƯƠNG 2: CƠ SỞ LÝ THUYẾT**
**2.1. Kiểm duyệt nội dung (Content Moderation)**
- **Khái niệm:** Là quá trình theo dõi, đánh giá và quyết định xem nội dung do người dùng tạo ra (User-Generated Content) có phù hợp với các quy định, chính sách của nền tảng hay không.
- **Các loại vi phạm thường gặp:** Nội dung người lớn (Adult/NSFW), bạo lực (Violence), lừa đảo (Spoof), nội dung gây sốc (Medical/Racy) và thư rác (Spam).

**2.2. Event-driven Architecture (Kiến trúc hướng sự kiện)**
- **Khái niệm Trigger (Trình kích hoạt):** Là một sự kiện xảy ra trong hệ thống (ví dụ: một tệp hình ảnh mới được upload lên Storage) đóng vai trò kích hoạt các tiến trình xử lý tự động tiếp theo mà không cần sự can thiệp thủ công.
- **Ưu điểm so với Polling:** Thay vì hệ thống phải liên tục truy vấn định kỳ (polling) xem có dữ liệu mới hay không gây lãng phí tài nguyên, kiến trúc Event-driven cho phép phản hồi ngay lập tức khi sự kiện xảy ra (real-time) và tiêu thụ tài nguyên hiệu quả hơn.

**2.3. Cloud Vision API**
- **SafeSearch Detection:** Là một tính năng của Google Cloud Vision API giúp phân tích và đưa ra mức độ tự tin (Likelihood) đối với các hạng mục nội dung nhạy cảm như Adult, Spoof, Medical, Violence và Racy.
- **Cách hoạt động:** Nhận đầu vào là hình ảnh (hoặc URI của hình ảnh trên Cloud Storage) và trả về kết quả phân loại dựa trên các mô hình Machine Learning mạnh mẽ của Google.

**2.4. Pub/Sub và xử lý bất đồng bộ**
- **Messaging system:** Dịch vụ gửi và nhận tin nhắn thời gian thực, cho phép các dịch vụ phần mềm giao tiếp với nhau mà không cần kết nối trực tiếp.
- **Ưu điểm:**
  - **Scale (Khả năng mở rộng):** Dễ dàng mở rộng theo lượng tin nhắn/sự kiện tăng vọt.
  - **Decouple (Khử liên kết):** Tách biệt logic giữa dịch vụ upload ảnh và dịch vụ xử lý, giúp hệ thống không bị tắc nghẽn nếu quá trình kiểm duyệt bị chậm.

---

**CHƯƠNG 3: PHÂN TÍCH & THIẾT KẾ HỆ THỐNG**
**3.1. Yêu cầu hệ thống**
- **Functional (Yêu cầu chức năng):**
  - Người dùng có thể upload hình ảnh lên hệ thống.
  - Hệ thống tự động kiểm tra nội dung hình ảnh ngay sau khi upload.
  - Các hình ảnh phát hiện vi phạm sẽ bị xử lý (xóa, chặn, hoặc gửi cảnh báo).
- **Non-functional (Yêu cầu phi chức năng):**
  - Thời gian xử lý kiểm duyệt cực nhanh (độ trễ thấp).
  - Khả năng mở rộng tốt khi có nhiều người dùng đồng thời tải ảnh.
  - Độ tin cậy cao, đảm bảo không bỏ sót quá trình kiểm duyệt.

**3.2. Kiến trúc tổng thể**
Mô tả các thành phần:
1. **Frontend (ReactJS):** Giao diện cho phép người dùng chọn và tải ảnh.
2. **Backend (Java Spring Boot):** Nhận file, lưu thông tin vào MySQL Database và đẩy file ảnh lên Google Cloud Storage.
3. **Cloud Storage (Bucket: `chat-app-avt-images-raw`):** Lưu trữ hình ảnh gốc vừa tải lên.
4. **Cloud Function (Node.js):** Trigger tự động kích hoạt khi có file mới ở Storage, đóng vai trò điều phối.
5. **Vision API:** Nhận request từ Cloud Function để kiểm tra mức độ an toàn của ảnh.
6. **Pub/Sub:** Nếu phát hiện vi phạm, Cloud Function sẽ đẩy thông báo lên Pub/Sub Topic để các service khác (Backend) cập nhật trạng thái hoặc xóa ảnh.

*(👉 Học viên chèn sơ đồ kiến trúc tại đây trong file Word)*

**3.3. Luồng xử lý (Workflow)**
1. **Upload ảnh:** Người dùng tải ảnh lên qua API `/files/upload` (Spring Boot), sau đó ảnh được đẩy lên bucket `chat-app-avt-images-raw`.
2. **Trigger kích hoạt:** Cloud Storage bắn sự kiện `google.storage.object.finalize` kích hoạt Cloud Function.
3. **Gọi Vision API:** Cloud Function gửi URI của ảnh cho Vision API để thực hiện tính năng SafeSearch.
4. **Phân tích kết quả:** Vision API trả về kết quả các chỉ số (Adult, Violence...).
5. **Xử lý vi phạm:** Nếu phát hiện vi phạm (ví dụ likelihood là LIKELY hoặc VERY_LIKELY), hệ thống tự động đánh dấu vi phạm qua Pub/Sub, tiến hành xóa file khỏi Storage và cập nhật log trên cơ sở dữ liệu.

**3.4. Thiết kế chi tiết**
- **3.4.1. Trigger:** Sử dụng Event Type liên quan đến thao tác tạo file mới trên bucket của Cloud Storage.
- **3.4.2. Logic kiểm duyệt:** Đặt ngưỡng (threshold) cho các thuộc tính SafeSearch. Nếu bất kỳ thuộc tính nào đạt mức cảnh báo cao sẽ bị coi là vi phạm.
- **3.4.3. Xử lý kết quả:** Xoá file trực tiếp từ Cloud Storage, gửi tín hiệu Pub/Sub để Backend Spring Boot xóa record tương ứng trong MySQL database (`file_db`) hoặc đánh dấu `violation_flag = true`.

---

**CHƯƠNG 4: CÀI ĐẶT HỆ THỐNG**
**4.1. Môi trường**
- **Frontend:** React, Node.js (dành cho package manager).
- **Backend:** Java 17, Spring Boot, MySQL.
- **Serverless & AI:** Node.js (cho Cloud Function), Google Cloud (GCS, Vision API, Pub/Sub).

**4.2. Cài đặt Cloud Storage**
- Tạo bucket: `chat-app-avt-images-raw`.
- Cấu hình quyền truy cập (IAM) sử dụng Service Account, cấp quyền `Storage Admin` để Backend Spring Boot (qua file `serviceAccount.json`) và Cloud Function có thể read/write dữ liệu.

**4.3. Cài đặt Cloud Function**
- Khởi tạo hàm Node.js trên GCP.
- Cấu hình Event Trigger: Lắng nghe sự kiện trên bucket `chat-app-avt-images-raw`.
- Code xử lý: Tích hợp thư viện `@google-cloud/vision` để phân tích ảnh ngay khi nhận được event payload.

**4.4. Tích hợp Vision API**
- Kích hoạt Cloud Vision API trên Google Cloud Console.
- Gửi request chứa cấu trúc `image` chỉ định bucket URI (`gs://chat-app-avt-images-raw/<filename>`).
- Nhận response chứa object `safeSearchAnnotation`.

**4.5. Pub/Sub**
- Tạo Topic: `image-moderation-events`.
- Publish message chứa thông tin hình ảnh (ID, trạng thái vi phạm) để các sub-system khác lắng nghe.

---

**CHƯƠNG 5: KẾT QUẢ & ĐÁNH GIÁ**
**5.1. Kết quả đạt được**
- Hệ thống hoạt động trơn tru theo luồng: Upload ảnh -> GCS -> Trigger Cloud Function -> Detect bằng Vision API -> Xử lý (Xóa/Giữ lại).
- Các API phía Java Backend hoạt động ổn định và có thể lưu trữ metadata của hình ảnh thành công.

**5.2. Demo hệ thống**
*(👉 Học viên chèn hình ảnh / screenshot giao diện upload, log trên Google Cloud Console và kết quả kiểm duyệt tại đây)*

**5.3. Đánh giá**
- **Ưu điểm:**
  - Quy trình hoàn toàn tự động, tiết kiệm nhân lực.
  - Tốc độ nhận diện nhanh, tích hợp mượt mà với môi trường Cloud hiện đại.
  - Dễ dàng mở rộng hoặc thêm các tiêu chí kiểm duyệt khác.
- **Nhược điểm:**
  - Bị phụ thuộc vào API của bên thứ 3 (Google Cloud).
  - Vẫn tồn tại tỷ lệ sai số nhất định (nhận diện nhầm hoặc bỏ sót) phụ thuộc vào độ chính xác của model Vision API.

---

**CHƯƠNG 6: HƯỚNG PHÁT TRIỂN**
- Xây dựng Dashboard quản trị viên để theo dõi, quản lý hình ảnh và thống kê tỷ lệ vi phạm.
- Lưu lại lịch sử kiểm duyệt (Moderation Logs) giúp audit và cải thiện hệ thống.
- Kết hợp với một mô hình AI Custom (tự huấn luyện) cho các nghiệp vụ đặc thù của ứng dụng.
- Mở rộng chức năng kiểm duyệt sang cả định dạng Video bằng Cloud Video Intelligence API.

---

**CHƯƠNG 7: KẾT LUẬN**
Đề tài đã hoàn thành được mục tiêu xây dựng một hệ thống kiểm duyệt hình ảnh tự động và hiệu quả. Bằng việc tận dụng sức mạnh của Google Cloud Vision API và kiến trúc Event-driven (Pub/Sub, Cloud Function), hệ thống đáp ứng tốt các yêu cầu về tốc độ, khả năng mở rộng và mang lại tính thực tiễn cao cho các ứng dụng trực tuyến hiện nay.

---

**TÀI LIỆU THAM KHẢO**
1. Tài liệu hướng dẫn chính thức từ Google Cloud (Google Cloud Docs).
2. Google Cloud Vision API Documentation.
3. Tài liệu về Spring Boot & Microservices.
4. Các bài báo, diễn đàn và blog kỹ thuật uy tín (Medium, StackOverflow, v.v.).

---

**PHỤ LỤC**
**API Response Mẫu từ Vision API (SafeSearch):**
```json
{
  "responses": [
    {
      "safeSearchAnnotation": {
        "adult": "VERY_UNLIKELY",
        "spoof": "UNLIKELY",
        "medical": "POSSIBLE",
        "violence": "VERY_UNLIKELY",
        "racy": "UNLIKELY"
      }
    }
  ]
}
```
*(Học viên chèn thêm đoạn code tiêu biểu của Cloud Function hoặc Spring Boot Controller vào phần này)*
