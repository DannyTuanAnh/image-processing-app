---
title: "BÁO CÁO MÔN HỌC: ĐIỆN TOÁN ĐÁM MÂY"
subtitle: "Đề tài: Hệ thống quản lý và kiểm duyệt ảnh tự động trên nền tảng Cloud"
date: "Tháng 04/2026"
---

**Tên trường:** Đại học Giao thông vận tải TP.HCM - **Khoa:** Công nghệ thông tin
  
**Môn học:** Điện toán đám mây [010412303905]

**Giảng viên hướng dẫn:** GV. NGUYỄN VĂN ĐÔN

**Nhóm thực hiện:** Nhóm 8

**Danh sách thành viên:**
1. **Trần Tuấn Anh** - MSSV: 072205000267 _(Vai trò: Cloud & Deployment)_
2. **Trần Hoàng Phương** - MSSV: 083205005715 _(Vai trò: Backend )_
3. **Trần Hải Đăng** - MSSV: 095205006586 _(Vai trò: Frontend & Documentation)_

**Link mã nguồn:** [Đường dẫn GitHub dự án](https://github.com/DannyTuanAnh/image-processing-app)

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# MỤC LỤC

```{=openxml}
<w:p><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \o "1-3" \h \z \u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>
```

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# CHƯƠNG 1: GIỚI THIỆU

## 1.1. Lý do chọn đề tài

Với sự phát triển mạnh mẽ của các nền tảng trực tuyến, mạng xã hội và các ứng dụng nhắn tin, lượng dữ liệu hình ảnh được người dùng tải lên hàng ngày là khổng lồ. Việc kiểm duyệt thủ công tốn rất nhiều thời gian, công sức và không thể đáp ứng được tốc độ phát triển của dữ liệu. Do đó, một hệ thống tải ảnh và quản lý lưu trữ an toàn, hướng tới kiểm duyệt tự động là một yêu cầu cấp thiết.

## 1.2. Mục tiêu đề tài

- Xây dựng hệ thống quản lý và tải hình ảnh (đặc biệt là ảnh đại diện/avatar).
- Tạo tiền đề tích hợp trí tuệ nhân tạo (Cloud Vision API) để phát hiện và phân loại các nội dung vi phạm tiêu chuẩn (nhạy cảm, bạo lực...).
- Đảm bảo tính ổn định và lưu trữ an toàn trên nền tảng điện toán đám mây.

## 1.3. Phạm vi đề tài

- Hệ thống tập trung vào việc xử lý và lưu trữ hình ảnh tĩnh.
- Sử dụng Google Cloud Storage để lưu trữ file thực tế.
- Backend xử lý nghiệp vụ được viết bằng Java Spring Boot, lưu trữ metadata qua MySQL.
- Frontend giao diện người dùng được xây dựng bằng thư viện React.

## 1.4. Phương pháp thực hiện

- Xây dựng kiến trúc API đồng bộ (Synchronous RESTful API) giữa Frontend và Backend.
- Tận dụng sức mạnh lưu trữ đám mây của Google Cloud Platform.
- Lên kế hoạch (dự kiến) tích hợp Google Cloud Vision API vào quy trình upload backend để đánh giá hình ảnh.

# CHƯƠNG 2: CƠ SỞ LÝ THUYẾT

## 2.1. Kiểm duyệt nội dung (Content Moderation)

- **Khái niệm:** Là quá trình theo dõi, đánh giá và quyết định xem nội dung do người dùng tạo ra (User-Generated Content) có phù hợp với các quy định, chính sách của nền tảng hay không.
- **Các loại vi phạm thường gặp:** Nội dung người lớn (Adult/NSFW), bạo lực (Violence), lừa đảo (Spoof), nội dung gây sốc (Medical/Racy).

## 2.2. Kiến trúc API Đồng bộ (Synchronous Architecture)

- **Khái niệm:** Các request từ client được gửi tới server và client sẽ chờ (block) cho đến khi nhận được response phản hồi từ server. Khác với kiến trúc thời gian thực (Real-time/Event-driven).
- **Ưu điểm:** Luồng xử lý dễ hiểu, dễ kiểm soát lỗi trực tiếp ngay trong một request duy nhất. Code đơn giản, phù hợp với các ứng dụng có luồng nghiệp vụ tuần tự.

## 2.3. Google Cloud Storage

- Dịch vụ lưu trữ đối tượng (Object Storage) an toàn, linh hoạt và hiệu năng cao của Google.
- Phù hợp lưu trữ tài nguyên tĩnh như hình ảnh, video với tính sẵn sàng cao.

## 2.4. Cloud Vision API (SafeSearch Detection)

- Tính năng của Google Cloud Vision API giúp phân tích và đưa ra mức độ tự tin (Likelihood) đối với các hạng mục nội dung nhạy cảm.

# CHƯƠNG 3: PHÂN TÍCH & THIẾT KẾ HỆ THỐNG

## 3.1. Yêu cầu hệ thống

### Functional (Yêu cầu chức năng)

- Người dùng có thể upload hình ảnh lên hệ thống qua giao diện React một cách mượt mà.
- Hình ảnh được lưu trữ an toàn trên Google Cloud Storage.
- Lưu trữ lịch sử tải lên trong cơ sở dữ liệu MySQL và hiển thị lại cho người dùng.

![Hình 3.1: Sơ đồ Use-case hệ thống](../diagrams/usecase.png)

### Non-functional (Yêu cầu phi chức năng)

- Khả năng lưu trữ lớn.
- Thời gian phản hồi API nhanh.
- Mã nguồn dễ bảo trì và mở rộng.

## 3.2. Kiến trúc tổng thể

Hệ thống hiện tại được thiết kế theo mô hình Client-Server truyền thống kết hợp Cloud Storage:

1. **Frontend (ReactJS):** Giao diện cho phép người dùng chọn và tải ảnh.
2. **Backend (Java Spring Boot):** Cung cấp các RESTful API cho phép upload và truy xuất ảnh.
3. **Database (MySQL):** Nơi lưu trữ thông tin metadata của ảnh.
4. **Cloud Storage:** Bucket `chat-app-avt-images-raw` lưu trữ hình ảnh vật lý.
5. **Vision API (Mở rộng tương lai):** Hệ thống chẩn đoán vi phạm.

![Hình 3.2: Kiến trúc tổng thể hệ thống](../diagrams/architecture.png)

## 3.3. Luồng xử lý (Workflow) hệ thống

1. **Gửi request:** Frontend React gọi API `POST /files/upload` có đính kèm file ảnh.
2. **Xử lý Backend:** Spring Boot Controller tiếp nhận, kiểm tra định dạng file (chỉ cho phép PNG/JPEG), tạo mã UUID và lưu metadata vào MySQL.
3. **Lưu trữ Cloud:** Backend tải byte data của file lên Google Cloud Storage qua Service Account.
4. **Phản hồi:** Backend trả về dữ liệu ảnh (bao gồm URL) cho Frontend.
5. **Cập nhật:** Frontend gọi `GET /files` để đồng bộ lại danh sách ảnh hiển thị.

![Hình 3.3: Luồng xử lý hệ thống](../diagrams/sequence.png)

## 3.4. Thiết kế Database

- **Bảng `File`:** Chứa các trường `id` (chuỗi UUID), `fileName`, `contentType`, `size`, `data` (binary), `createdAt`, và `url`.

![Hình 3.4: Thiết kế Database](../diagrams/database.png)

# CHƯƠNG 4: CÀI ĐẶT HỆ THỐNG

## 4.1. Môi trường phát triển

- **Frontend:** React, Node.js.
- **Backend:** Java 17, Spring Boot, Spring Data JPA.
- **Database:** MySQL 8.0 (triển khai qua Docker).
- **Cloud Provider:** Google Cloud Platform.

## 4.2. Cấu hình Backend (Spring Boot)

- Tích hợp thư viện `google-cloud-storage`.
- Cấu hình xác thực an toàn qua file `serviceAccount.json` đặt trong `resources/certs/gcs/`.
- Lớp `FileService.java` chịu trách nhiệm giao tiếp trực tiếp với MySQL và Google Cloud Storage.

## 4.3. Cài đặt Frontend (React)

- Sử dụng `UploadContext` để quản lý global state của quá trình tải ảnh (Trạng thái: welcome, upload, processing, completed).
- Gọi RESTful API bằng phương thức bất đồng bộ `async/await` để đảm bảo UI không bị đóng băng (freeze).

## 4.4. Cấu hình Google Cloud Storage

- Khởi tạo bucket: `chat-app-avt-images-raw`.
- Thiết lập quyền (IAM) cho Service Account để Backend có quyền ghi (write) file lên Cloud.

# CHƯƠNG 5: KẾT QUẢ & ĐÁNH GIÁ

## 5.1. Kết quả đạt được

- Xây dựng thành công hệ thống upload ảnh từ đầu đến cuối (End-to-End).
- Hoàn thiện luồng upload đồng bộ từ Frontend tới Cloud Storage.
- Ứng dụng hoạt động ổn định, dữ liệu nhất quán giữa MySQL và Google Cloud.

## 5.2. Đánh giá

### Ưu điểm

- Kiến trúc sáng sủa, dễ dàng triển khai, bảo trì và tích hợp thêm tính năng mới.
- Việc tách biệt lưu trữ file trên Cloud Storage giúp giảm tải đáng kể cho server xử lý cục bộ.

### Nhược điểm

- Đang sử dụng luồng gọi API đồng bộ (Synchronous). Nếu sau này tích hợp Vision API kiểm duyệt trực tiếp, thời gian chờ upload của người dùng có thể tăng lên.
- Chưa có kiến trúc Event-driven (như Pub/Sub) để xử lý dữ liệu lớn theo thời gian thực.

# CHƯƠNG 6: HƯỚNG PHÁT TRIỂN

- Tích hợp chính thức thư viện Google Cloud Vision API vào Backend để hệ thống tự động từ chối ngay các file vi phạm khi upload.
- Chuyển đổi một phần kiến trúc sang luồng bất đồng bộ (Asynchronous/Event-driven) sử dụng Message Broker (ví dụ: Google Cloud Pub/Sub) để quá trình kiểm duyệt không làm chặn (block) request của người dùng.
- Thêm cơ chế Authentication (xác thực) và Authorization (phân quyền) bằng JWT.

# CHƯƠNG 7: KẾT LUẬN

Đề tài đã hoàn thành tốt giai đoạn xây dựng nền tảng cốt lõi cho một hệ thống quản lý hình ảnh trên Cloud. Thông qua việc ứng dụng Java Spring Boot, React và Google Cloud Storage, dự án đảm bảo khả năng lưu trữ an toàn, truy xuất nhanh chóng và tạo bộ khung kiến trúc vững chắc. Điều này giúp hệ thống sẵn sàng mở rộng và áp dụng các mô hình AI như Vision API trong các giai đoạn phát triển tiếp theo.

# TÀI LIỆU THAM KHẢO

1. Tài liệu hướng dẫn Spring Boot (Spring Docs).
2. Nền tảng tài liệu Google Cloud Storage.
3. Tài liệu phát triển giao diện React (ReactJS Docs).
