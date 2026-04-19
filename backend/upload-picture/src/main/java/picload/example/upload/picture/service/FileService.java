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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;
    private final FileMapper fileMapper;
    public static final List<String> ALLOWED_TYPES_PIC = List.of("image/png", "image/jpeg");

    private FileRepository repository;
    public FileUploadResponse upload(MultipartFile multipartFile)
        {
            if(!ALLOWED_TYPES_PIC.contains(multipartFile.getContentType()))
            {
                throw new RuntimeException("Only PNG/JPG allowed");
            }
            //Tao url mau de test-> sau nay thay bang url cloud
            String urlRun = "http://localhost:8090/upload/files/"+ multipartFile.getOriginalFilename();
            File file = File.builder()
                    .fileName(multipartFile.getOriginalFilename())
                    .url(urlRun)
                    .contentType(multipartFile.getContentType())
                    .size(multipartFile.getSize())
                    .createdAt(LocalDateTime.now())
                    .build();
            File saved = fileRepository.save(file);
            return fileMapper.toResponse(saved);
        }

    public FileUploadResponse getImage(String id)
    {
        return fileMapper.toResponse(fileRepository.findById(id).orElseThrow(()
                -> new RuntimeException("Image is not exist")));
    }

    public List<FileUploadResponse> getAllImage()
    {
        return fileMapper.toListFileUploadResponse(fileRepository.findAll());
    }

    // public FileUploadResponse updateImage(String id, MultipartFile multipartFile)
    // {
    //     File file = fileRepository.findById(id).orElseThrow(()-> new RuntimeException("Image is not exist"));
    //     fileMapper.updateImage(file, multipartFile);
    //     return fileMapper.toResponse(fileRepository.save(file));
    // }

    public void deleteImage(String id)
    {
        fileRepository.deleteById(id);
    }

}
