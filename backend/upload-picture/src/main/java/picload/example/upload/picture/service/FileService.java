package picload.example.upload.picture.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import picload.example.upload.picture.dto.response.FileUploadResponse;
import picload.example.upload.picture.entity.File;
import picload.example.upload.picture.mapper.FileMapper;
import picload.example.upload.picture.repository.FileRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    public static final List<String> ALLOWED_TYPES_PIC = List.of("image/png", "image/jpeg");


    public FileUploadResponse upload(MultipartFile multipartFilefile)
        {
            if(!ALLOWED_TYPES_PIC.contains(multipartFilefile.getContentType()))
            {
                throw new RuntimeException("Only PNG/JPG allowed");
            }
            //Tao url mau de test-> sau nay thay bang url cloud
            String urlRun = "http://localhost:8090/upload/files/"+ multipartFilefile.getOriginalFilename();
            File file = File.builder()
                    .fileName(multipartFilefile.getOriginalFilename())
                    .url(urlRun)
                    .contentType(multipartFilefile.getContentType())
                    .size(multipartFilefile.getSize())
                    .createdAt(LocalDateTime.now())
                    .build();
            File saved = fileRepository.save(file);
            return FileMapper.toResponse(saved);
        }
}
