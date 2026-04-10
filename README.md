# Smart Image Processing Application (Study Project)

## Phân chia thành viên và nhiệm vụ

**Member 1 — Frontend (React) - Trần Hải Đăng**
Nhiệm vụ

- UI upload ảnh
- preview ảnh
- gọi API upload
- hiển thị ảnh sau xử lý

Output

- trang upload + gallery
- demo trực quan

**Member 2 — Backend (Java) - Trần Hoàng Phương**
Nhiệm vụ

- API upload (Spring Boot)
- tạo signed URL để upload lên Storage
- lưu metadata (tên file, link)

Output

- REST API
- kết nối với Cloud Storage

**Member 3 — Cloud & Image Processing - Trần Tuấn Anh**
Nhiệm vụ

- cấu hình GCP
- tạo bucket Storage
- viết Cloud Function:
- resize
- tạo thumbnail
- test trigger

Output

- pipeline xử lý ảnh tự động

**Member 4 — Documentation + Presentation - Trần Tuấn Anh**
Nhiệm vụ

- viết báo cáo (.docx)
- làm slide
- quay video demo (.fbr)

Output

- file Word hoàn chỉnh
- video minh chứng
- slide thuyết trình

## Cấu trúc thư mục

```
project-root/
│
├── frontend/                  # React
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── UploadForm.jsx
│       │   ├── ImagePreview.jsx
│       │   └── Gallery.jsx
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       └── main.jsx
│
├── backend/                  # Java Spring Boot
│   ├── src/main/java/com/app/
│   │   ├── controller/
│   │   │   └── UploadController.java
│   │   ├── service/
│   │   │   └── StorageService.java
│   │   └── model/
│   │       └── Image.java
│   └── pom.xml
│
├── cloud-function/           # xử lý ảnh
│   ├── index.js
│   ├── package.json
│   └── imageProcessor.js
│
├── docs/
│   ├── report.docx
│   ├── slides.pptx
│   └── demo.fbr
│
├── diagrams/
│   └── architecture.png
│
└── README.md
```

## Nội dung báo cáo (.docx)

1. Giới thiệu

- mục tiêu đề tài
- lý do chọn GCP

2. Công nghệ sử dụng

- React
- Java (Spring Boot)
- GCP services

3. Kiến trúc hệ thống

sơ đồ:

```
React → Java API → Storage → Cloud Function → Storage
```

4. Chi tiết triển khai

- upload ảnh
- xử lý ảnh (resize, thumbnail)

5. Kết quả

- ảnh trước/sau
- demo

6. Đánh giá

- ưu điểm
- hạn chế

## Video (.fbr)

Nội dung quay:

- Giới thiệu hệ thống
- Upload ảnh
- Hiển thị ảnh sau xử lý
- Giải thích flow

## Thuyết trình (5–10 phút)

Slide nên có:

- Giới thiệu đề tài
- Kiến trúc hệ thống
- Công nghệ (GCP)
- Demo
- Kết luận
