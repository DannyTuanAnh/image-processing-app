package picload.example.upload.picture.service;

import com.google.cloud.storage.*;
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

    private static final String BUCKET_RAW = "chat-app-avt-images-raw";
    private static final String BUCKET_PROCESSED = "chat-app-avt-images-processed"; 
    private static final List<String> ALLOWED_TYPES = List.of("image/png", "image/jpeg");

    // ========================= UPLOAD (RAW -> PROCESSED) =========================
    public FileUploadResponse upload(MultipartFile file) {
        if (file.isEmpty()) throw new RuntimeException("File is empty");
        if (!ALLOWED_TYPES.contains(file.getContentType())) throw new RuntimeException("Only PNG/JPG allowed");

        // 1. Xử lý đuôi file để link ảnh không bị lỗi
        String extension = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;

        // BƯỚC 1: Đẩy lên Bucket RAW (Ảnh gốc)
        uploadToGCS(file, fileName, BUCKET_RAW);

        // BƯỚC 2: Copy sang Bucket PROCESSED (Ảnh công khai)
        copyFileBetweenBuckets(fileName, BUCKET_RAW, BUCKET_PROCESSED);

        // BƯỚC 3: Tạo URL dẫn đến ảnh đã xử lý
        String finalUrl = String.format("https://storage.googleapis.com/%s/%s", BUCKET_PROCESSED, fileName);

        // BƯỚC 4: Lưu Metadata vào SQL (data = null để tối ưu DB)
        File entity = File.builder()
                .fileName(fileName)
                .contentType(file.getContentType())
                .size(file.getSize())
                .createdAt(LocalDateTime.now())
                .url(finalUrl)
                .data(null) 
                .build();

        return fileMapper.toResponse(fileRepository.save(entity));
    }

    // ========================= GCS LOGIC =========================
    private void uploadToGCS(MultipartFile file, String objectName, String bucketName) {
        Storage storage = StorageOptions.getDefaultInstance().getService();
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
        try {
            storage.create(blobInfo, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Upload to RAW failed", e);
        }
    }

    private void copyFileBetweenBuckets(String fileName, String fromBucket, String toBucket) {
        Storage storage = StorageOptions.getDefaultInstance().getService();
        storage.copy(Storage.CopyRequest.newBuilder()
                .setSource(BlobId.of(fromBucket, fileName))
                .setTarget(BlobId.of(toBucket, fileName))
                .build()).getResult();
    }

    // ========================= GET/DELETE =========================
    public List<FileUploadResponse> getAllImage() {
        return fileMapper.toListFileUploadResponse(fileRepository.findAll());
    }

    public void deleteImage(String id) {
        fileRepository.deleteById(id);
    }
}