package picload.example.upload.picture.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;
import picload.example.upload.picture.dto.request.FileUploadRequest;
import picload.example.upload.picture.dto.response.FileUploadResponse;
import picload.example.upload.picture.entity.File;
import picload.example.upload.picture.mapper.FileMapper;
import picload.example.upload.picture.repository.FileRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final FileMapper fileMapper;
    public static final List<String> ALLOWED_TYPES_PIC = List.of("image/png", "image/jpeg");

    public FileUploadResponse upload(MultipartFile multipartFile) throws IOException {
            if(!ALLOWED_TYPES_PIC.contains(multipartFile.getContentType()))
            {
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
            //Tao url mau de test-> sau nay thay bang url cloud
            String urlRun = "http://localhost:8090/upload/files/" + saved.getId();
            file.setUrl(urlRun);
            return fileMapper.toResponse(saved);
        }

    public File getImage(String id)
    {
        return fileRepository.findById(id).orElseThrow(()-> new RuntimeException("IMG not exist!"));
    }

    public FileUploadResponse getImageInfo(String id)
    {
        return fileMapper.toResponse(fileRepository.findById(id).orElseThrow(()
                -> new RuntimeException("Image is not exist")));
    }

    public List<FileUploadResponse> getAllImage()
    {
        return fileMapper.toListFileUploadResponse(fileRepository.findAll());
    }

    public void deleteImage(String id)
    {
        fileRepository.deleteById(id);
    }

}
