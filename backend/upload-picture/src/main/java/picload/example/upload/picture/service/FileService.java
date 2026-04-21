package picload.example.upload.picture.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.WriteChannel;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.StorageException;
import com.google.cloud.storage.StorageOptions;

import picload.example.upload.picture.dto.request.FileUploadRequest;
import picload.example.upload.picture.dto.response.FileUploadResponse;
import picload.example.upload.picture.entity.File;
import picload.example.upload.picture.mapper.FileMapper;
import picload.example.upload.picture.repository.FileRepository;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.time.LocalDateTime;
import java.util.List;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.cloud.storage.StorageException;
import com.google.cloud.storage.WriteChannel;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final FileMapper fileMapper;
    public static final List<String> ALLOWED_TYPES_PIC = List.of("image/png", "image/jpeg");

    public FileUploadResponse upload(MultipartFile multipartFile) throws IOException {
        if (!ALLOWED_TYPES_PIC.contains(multipartFile.getContentType())) {
            throw new RuntimeException("Only PNG/JPG allowed");
        }
        File file = File.builder()
                .fileName(multipartFile.getOriginalFilename())
                .contentType(multipartFile.getContentType())
                .size(multipartFile.getSize())
                .createdAt(LocalDateTime.now())
                .data(multipartFile.getBytes())
                .build();
        File saved = fileRepository.save(file);
        // Tao url mau de test-> sau nay thay bang url cloud -> Da thay bang url cloud
        uploadToGCS(multipartFile, saved.getFileName(), multipartFile.getContentType());
        String urlRun = "https://image-frontend.duckdns.org/" + saved.getFileName();
        file.setUrl(urlRun);
        return fileMapper.toResponse(saved);
    }

    public File getImage(String id) {
        return fileRepository.findById(id).orElseThrow(() -> new RuntimeException("IMG not exist!"));
    }

    public FileUploadResponse getImageInfo(String id) {
        return fileMapper
                .toResponse(fileRepository.findById(id).orElseThrow(() -> new RuntimeException("Image is not exist")));
    }

    public List<FileUploadResponse> getAllImage() {
        return fileMapper.toListFileUploadResponse(fileRepository.findAll());
    }

    public void deleteImage(String id) {
        fileRepository.deleteById(id);
    }

    private Storage connectGCS() {
        String serviceAccountKey = "java/picload/example/upload/picture/certs/gcs/serviceAccount.json";
        try {
            if (serviceAccountKey != null && !serviceAccountKey.isBlank()) {
                try (FileInputStream fis = new FileInputStream(serviceAccountKey)) {
                    ServiceAccountCredentials creds = ServiceAccountCredentials.fromStream(fis);
                    return StorageOptions.newBuilder().setCredentials(creds).build().getService();
                }
            } else {
                return StorageOptions.getDefaultInstance().getService();
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize Google Cloud Storage client: " + e.getMessage(), e);
        }
    }

    private void uploadToGCS(MultipartFile file, String objectName, String contentType) throws IOException {
        String bucketName = "chat-app-avt-images-raw";

        Storage storage = connectGCS();
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(contentType)
                .setCacheControl("no-store, max-age=0")
                .build();

        try (WriteChannel writer = storage.writer(blobInfo);
                InputStream in = file.getInputStream()) {
            byte[] buffer = new byte[1024 * 1024];
            int len;
            while ((len = in.read(buffer)) > 0) {
                writer.write(ByteBuffer.wrap(buffer, 0, len));
            }
        } catch (StorageException e) {
            throw new RuntimeException("Failed to upload to GCS: " + e.getMessage(), e);
        }
    }

}
