package picload.example.upload.picture.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import picload.example.upload.picture.entity.File;

public interface FileRepository extends JpaRepository<File, Long> {
}
