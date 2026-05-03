package picload.example.upload.picture.service;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.cloud.storage.StorageException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import picload.example.upload.picture.dto.response.FileUploadResponse;
import picload.example.upload.picture.entity.File;
import picload.example.upload.picture.mapper.FileMapper;
import picload.example.upload.picture.repository.FileRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final FileRepository fileRepository;
    private final FileMapper fileMapper;

    private static final String BUCKET_NAME = "chat-app-avt-images-raw";
    private static final List<String> ALLOWED_TYPES_PIC = List.of("image/png", "image/jpeg");

    // ========================= UPLOAD =========================
    public FileUploadResponse upload(MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (!ALLOWED_TYPES_PIC.contains(file.getContentType())) {
            throw new RuntimeException("Only PNG/JPG allowed");
        }

        // 1. Lấy đuôi file (Extension) - Rất quan trọng để link ảnh hoạt động
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        // 2. Tạo tên file mới: UUID + extension (Ví dụ: 550e8400-e29b.png)
        String fileNameOnGCS = UUID.randomUUID().toString() + extension;

        // 3. Upload lên Google Cloud Storage trước
        uploadToGCS(file, fileNameOnGCS, file.getContentType());

        // 4. Tạo URL thật để truy cập ảnh công khai
        String url = String.format("https://storage.googleapis.com/%s/%s", BUCKET_NAME, fileNameOnGCS);

        // 5. Lưu Metadata vào Cloud SQL (Để .data(null) cho nhẹ database)
        File entity = File.builder()
                .fileName(fileNameOnGCS)
                .contentType(file.getContentType())
                .size(file.getSize())
                .createdAt(LocalDateTime.now())
                .url(url)
                .data(null) // Không lưu byte vào DB để tối ưu dung lượng
                .build();

        File saved = fileRepository.save(entity);
        log.info("Successfully uploaded {} to GCS and saved metadata to DB", fileNameOnGCS);

        return fileMapper.toResponse(saved);
    }

    // ========================= GET =========================
    public File getImage(String id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + id));
    }

    public List<FileUploadResponse> getAllImage() {
        return fileMapper.toListFileUploadResponse(fileRepository.findAll());
    }

    public FileUploadResponse getImageInfo(String id) {
        return fileMapper.toResponse(
                fileRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Image not found with id: " + id))
        );
    }

    // ========================= DELETE =========================
    public void deleteImage(String id) {
        // Lưu ý: Trong thực tế bạn nên xóa cả file trên GCS tại đây
        fileRepository.deleteById(id);
    }

    // ========================= GCS CORE LOGIC =========================
    private Storage getStorage() {
        // Tự động sử dụng quyền của Service Account khi chạy trên Cloud Run
        return StorageOptions.getDefaultInstance().getService();
    }

    private void uploadToGCS(MultipartFile file, String objectName, String contentType) {
        Storage storage = getStorage();
        BlobId blobId = BlobId.of(BUCKET_NAME, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(contentType)
                .setCacheControl("public, max-age=31536000") // Cache 1 năm cho hiệu năng tốt
                .build();

        try {
            storage.create(blobInfo, file.getBytes());
        } catch (IOException e) {
            log.error("Error reading file bytes: {}", e.getMessage());
            throw new RuntimeException("Cannot read file bytes", e);
        } catch (StorageException e) {
            log.error("GCS Upload Error: {}", e.getMessage());
            throw new RuntimeException("Upload GCS failed: " + e.getMessage(), e);
        }
    }
}