package picload.example.upload.picture.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import picload.example.upload.picture.dto.response.FileUploadResponse;
import picload.example.upload.picture.service.FileService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/files")
public class FileController {
    FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> upload(@RequestParam("image")MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(fileService.upload(image));
    }
    @GetMapping("/{id}")
    public ResponseEntity<FileUploadResponse> getImage(@PathVariable String id)
    {
        return ResponseEntity.ok(fileService.getImage(id));
    }
    @GetMapping()
    public ResponseEntity<List<FileUploadResponse>> getAllImage()
    {
        return ResponseEntity.ok(fileService.getAllImage());
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<FileUploadResponse> updateImage(@PathVariable String id,
//                                                          @RequestParam("image") MultipartFile image)
//    {
//        return ResponseEntity.ok(fileService.updateImage(id, image));
//    }

    @DeleteMapping("/{id}")
    String deleteImage(@PathVariable String id)
    {
        fileService.deleteImage(id);
        return "Image deleted!";
    }
}
