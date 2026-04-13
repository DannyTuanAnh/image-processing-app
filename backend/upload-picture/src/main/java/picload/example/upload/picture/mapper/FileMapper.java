package picload.example.upload.picture.mapper;

import picload.example.upload.picture.dto.response.FileUploadResponse;
import picload.example.upload.picture.entity.File;

public class FileMapper {
    public static FileUploadResponse toResponse(File file)
    {
        return FileUploadResponse.builder()
                .id(file.getId())
                .fileName(file.getFileName())
                .url(file.getUrl())
                .contentType(file.getContentType())
                .size(file.getSize())
                .createdAt(file.getCreatedAt())
                .build();
    }
}
