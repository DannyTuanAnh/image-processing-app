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
    private static final List<String> ALLOWED_TYPES_PIC =
            List.of("image/png", "image/jpeg");

    public FileUploadResponse upload(MultipartFile multipartFile) throws IOException {
        if (!ALLOWED_TYPES_PIC.contains(multipartFile.getContentType())) {
            throw new RuntimeException("Only PNG/JPG allowed");
        }
        String uuid = UUID.randomUUID().toString();

        File file = File.builder()
                .fileName(uuid)
                .contentType(multipartFile.getContentType())
                .size(multipartFile.getSize())
                .createdAt(LocalDateTime.now())
                .data(multipartFile.getBytes())
                .build();
        File saved = fileRepository.save(file);
        // Tao url mau de test-> sau nay thay bang url cloud -> Da thay bang url cloud
        uploadToGCS(multipartFile, uuid, multipartFile.getContentType());
        String urlRun = "https://image-frontend.duckdns.org/" + uuid;
        file.setUrl(urlRun);
        return fileMapper.toResponse(saved);
    }

    // ========================= GET =========================
    public File getImage(String id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("IMG not exist!"));
    }

    public List<FileUploadResponse> getAllImage() {
        return fileMapper.toListFileUploadResponse(fileRepository.findAll());
    }

    public FileUploadResponse getImageInfo(String id) {
        return fileMapper.toResponse(
                fileRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Image not exist"))
        );
    }

    // ========================= DELETE =========================
    public void deleteImage(String id) {
        fileRepository.deleteById(id);
    }

    // ========================= GCS =========================
    private Storage getStorage() {
        // Cloud Run: tự dùng service account của GCP (KHÔNG cần json)
        return StorageOptions.getDefaultInstance().getService();
    }

    private void uploadToGCS(MultipartFile file, String objectName, String contentType) {
        Storage storage = getStorage();

        BlobId blobId = BlobId.of(BUCKET_NAME, objectName);

        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(contentType)
                .setCacheControl("public, max-age=31536000")
                .build();

        try {
            storage.create(blobInfo, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Cannot read file bytes", e);
        } catch (StorageException e) {
            throw new RuntimeException("Upload GCS failed: " + e.getMessage(), e);
        }
    }

    // ========================= BACKUP SAFE =========================
    private byte[] getBytesSafely(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Cannot read file bytes for backup", e);
        }
    }
}