package picload.example.upload.picture.mapper;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import picload.example.upload.picture.dto.request.FileUploadRequest;
import picload.example.upload.picture.dto.response.FileUploadResponse;
import picload.example.upload.picture.entity.File;

import java.util.List;
@Component
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

    public static List<FileUploadResponse> toListFileUploadResponse(List<File> file)
    {
        return file.stream()
                .map(FileMapper::toResponse)
                .toList();
    }

    // public void updateImage(File file, MultipartFile multipartFile)
    // {
    //     if(multipartFile != null && !multipartFile.isEmpty())
    //     {
    //         file.setFileName(multipartFile.getOriginalFilename());
    //         file.setContentType(multipartFile.getContentType());
    //         file.setSize(multipartFile.getSize());
    //     }
    // }
}
