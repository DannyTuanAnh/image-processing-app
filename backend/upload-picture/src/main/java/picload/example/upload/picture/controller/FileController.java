package picload.example.upload.picture.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import picload.example.upload.picture.dto.response.FileUploadResponse;
import picload.example.upload.picture.entity.File;
import picload.example.upload.picture.service.FileService;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/files")
public class FileController {
    FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> upload(@RequestParam("image")MultipartFile image) throws IOException {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(fileService.upload(image));
    }
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> viewImage(@PathVariable String id) {

        File file = fileService.getImage(id);

        return ResponseEntity.ok()
                .header("Content-Type", file.getContentType())
                .body(file.getData());
    }
    @GetMapping()
    public ResponseEntity<List<FileUploadResponse>> getAllImage()
    {
        return ResponseEntity.ok(fileService.getAllImage());
    }
    @DeleteMapping("/{id}")
    String deleteImage(@PathVariable String id)
    {
        fileService.deleteImage(id);
        return "Image deleted!";
    }
}
