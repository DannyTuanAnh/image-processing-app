import { createContext, useContext, useState, useEffect } from "react";
import { Status } from "../utils/constant";
import { uploadImage, getAllImages, deleteImage } from "../services/api";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [status, setStatus] = useState(Status.welcome);
  const [items, setItems] = useState([]);

  // Hàm tải dữ liệu lịch sử ảnh
  const fetchImages = async () => {
    try {
      const backendImages = await getAllImages();

      const merged = backendImages.map((img) => ({
        ...img,
        date: img.createdAt || new Date().toISOString(),
      }));

      // Sắp xếp theo thời gian mới nhất
      merged.sort((a, b) => new Date(b.date) - new Date(a.date));

      setItems(merged);
    } catch (err) {
      console.error("Failed to fetch images from backend", err);
    }
  };

  // Cập nhật items khi khởi tạo context
  useEffect(() => {
    fetchImages();
  }, []);

  // Chọn ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setStatus(Status.upload);
    }
  };

  // Upload thật (có API)
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setStatus(Status.processing);

      // Gửi file đến backend
      const res = await uploadImage(selectedFile);

      const imageUrl = res.url || selectedImage;

      setProcessedImage(imageUrl);

      // Fetch lại lịch sử
      await fetchImages();

      setStatus(Status.completed);
    } catch (err) {
      console.error(err);
      setStatus(Status.error);
    }
  };

  const toggleReport = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        String(it.id) === String(id) ? { ...it, reported: !it.reported } : it,
      ),
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    try {
      await deleteImage(id);

      const idStr = String(id);

      setItems((prev) => prev.filter((it) => String(it.id) !== idStr));
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const clearHistory = async () => {
    if (
      !confirm("Xác nhận xóa toàn bộ lịch sử tải lên trên máy chủ và hệ thống?")
    )
      return;

    for (const it of items) {
      try {
        await deleteImage(it.id);
      } catch (e) {
        console.error("Failed to delete", it.id, e);
      }
    }

    setItems([]);
  };

  return (
    <UploadContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        processedImage,
        setProcessedImage,
        status,
        setStatus,
        items,
        handleImageChange,
        handleUpload,
        toggleReport,
        handleDelete,
        clearHistory,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
