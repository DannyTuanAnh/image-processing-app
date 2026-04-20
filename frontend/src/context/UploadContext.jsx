import { createContext, useContext, useState, useEffect } from "react";
import { Status } from "../utils/constant";
import { uploadImage, getAllImages, deleteImage } from "../services/api";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingOption, setProcessingOption] = useState([]);
  const [processedImage, setProcessedImage] = useState(null);
  const [status, setStatus] = useState(Status.welcome);
  const [items, setItems] = useState([]);

  // Hàm tải dữ liệu lịch sử ảnh
  const fetchImages = async () => {
    try {
      const backendImages = await getAllImages();
      const localData = JSON.parse(localStorage.getItem('localData') || '{}');
      
      const merged = backendImages.map(img => {
        const idStr = String(img.id);
        return {
          ...img,
          options: localData[idStr]?.options || [],
          reported: localData[idStr]?.reported || false,
          date: img.createdAt || new Date().toISOString()
        };
      });
      
      // Sắp xếp tĩnh theo thời gian tạo mới nhất
      merged.sort((a, b) => new Date(b.date) - new Date(a.date));
      setItems(merged);
    } catch (err) {
      console.error("Failed to fetch images from backend", err);
    }
  };

  // Cập nhật items khi vừa khởi tạo context
  useEffect(() => {
    fetchImages();
  }, []);

  // chọn ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setStatus(Status.upload);
    }
  };

  // chọn option xử lý
  const handleProcessingOptionChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setProcessingOption((prev) => [...prev, value]);
      setStatus(Status.clickedOption);
    } else {
      setProcessingOption((prev) => prev.filter((item) => item !== value));
    }
  };

  // upload thật (có API)
  const handleUpload = async () => {
    if (!selectedFile || processingOption.length === 0) return;

    try {
      setStatus(Status.processing);

      // Gửi file đến backend
      const res = await uploadImage(selectedFile);

      const imageUrl = res.url || selectedImage;
      setProcessedImage(imageUrl);

      // Lưu lại thông tin xử lý vào localStorage do backend chưa có schema cho options
      const localData = JSON.parse(localStorage.getItem('localData') || '{}');
      localData[String(res.id)] = {
        options: processingOption,
        reported: false
      };
      localStorage.setItem('localData', JSON.stringify(localData));

      // Fetch lại lịch sử
      await fetchImages();

      setStatus(Status.completed);
    } catch (err) {
      console.error(err);
      setStatus(Status.error);
    }
  };

  const toggleReport = (id) => {
    const idStr = String(id);
    const localData = JSON.parse(localStorage.getItem('localData') || '{}');
    if (!localData[idStr]) localData[idStr] = { options: [], reported: false };
    localData[idStr].reported = !localData[idStr].reported;
    localStorage.setItem('localData', JSON.stringify(localData));

    setItems(prev => prev.map(it => String(it.id) === idStr ? { ...it, reported: localData[idStr].reported } : it));
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    try {
      await deleteImage(id);
      
      const idStr = String(id);
      const localData = JSON.parse(localStorage.getItem('localData') || '{}');
      delete localData[idStr];
      localStorage.setItem('localData', JSON.stringify(localData));
      
      setItems(prev => prev.filter(it => String(it.id) !== idStr));
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const clearHistory = async () => {
    if (!confirm("Xác nhận xóa toàn bộ lịch sử tải lên trên máy chủ và hệ thống?")) return;
    for (const it of items) {
      try {
        await deleteImage(it.id);
      } catch (e) {
        console.error("Failed to delete", it.id, e);
      }
    }
    localStorage.setItem('localData', JSON.stringify({}));
    setItems([]);
  };

  return (
    <UploadContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        processingOption,
        setProcessingOption,
        processedImage,
        setProcessedImage,
        status,
        setStatus,
        items,
        handleImageChange,
        handleProcessingOptionChange,
        handleUpload,
        toggleReport,
        handleDelete,
        clearHistory
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
