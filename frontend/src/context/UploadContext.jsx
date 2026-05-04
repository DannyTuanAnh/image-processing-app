import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Status } from "../utils/constant";
import { uploadImage, getAllImages, deleteImage } from "../services/api";
import { createSSEConnection } from "../services/sse";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [status, setStatus] = useState(Status.welcome);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const currentUploadIdRef = useRef(null);

  // Hàm tải dữ liệu lịch sử ảnh
  const fetchImages = async () => {
    try {
      const backendImages = await getAllImages();
      console.log("backendImages", backendImages);

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

  useEffect(() => {
    const sse = createSSEConnection(
      async (data) => {
        console.log("Received SSE:", data);
        console.log("currentUploadIdRef:", currentUploadIdRef.current);

        await fetchImages();

        if (!currentUploadIdRef.current) {
          console.log("Skip SSE: currentUploadIdRef is null");
          return;
        }

        if (data.user_id !== currentUploadIdRef.current) {
          console.log("Skip SSE: ID mismatch", {
            sseUserId: data.user_id,
            currentUploadId: currentUploadIdRef.current,
          });
          return;
        }

        if (data.status === "processed") {
          setProcessedImage(data.file_path);
          setMessage("Upload thành công. Ảnh của bạn hợp lệ.");
          setStatus(Status.completed);
          currentUploadIdRef.current = null;
        }

        if (data.status === "rejected") {
          setProcessedImage(null);
          setMessage(
            "Ảnh bị từ chối. Ảnh của bạn vi phạm tiêu chuẩn cộng đồng.",
          );
          setStatus(Status.error);
          currentUploadIdRef.current = null;
        }
      },
      (err) => {
        console.error("SSE connection error", err);
      },
    );

    return () => {
      sse.close();
      console.log("SSE closed");
    };
  }, []);

  // Chọn ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setProcessedImage(null);
      setMessage("");
      setStatus(Status.upload);
    }
  };

  // Upload thật (có API)
  // const handleUpload = async () => {
  //   if (!selectedFile) return;

  //   try {
  //     setStatus(Status.processing);

  //     // Gửi file đến backend
  //     const res = await uploadImage(selectedFile);

  //     const imageUrl = res.url || selectedImage;

  //     setProcessedImage(imageUrl);

  //     // Fetch lại lịch sử
  //     await fetchImages();

  //     setStatus(Status.completed);
  //   } catch (err) {
  //     console.error(err);
  //     setStatus(Status.error);
  //   }
  // };
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setProcessedImage(null);
      setMessage("");
      setStatus(Status.processing);

      // upload file
      const res = await uploadImage(selectedFile);

      // set ngay lập tức id để SSE có thể match
      currentUploadIdRef.current = res?.fileName || res?.id || null;

      console.log("Upload response:", res);
      console.log("currentUploadIdRef set to:", currentUploadIdRef.current);

      if (!currentUploadIdRef.current) {
        setMessage("Không nhận được mã file từ server.");
        setStatus(Status.error);
        return;
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload thất bại.");
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
        message,
        setMessage,
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
