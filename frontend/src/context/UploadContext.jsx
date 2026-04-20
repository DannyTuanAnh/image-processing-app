import { createContext, useContext, useState } from "react";
import { Status } from "../utils/constant";
import { uploadImage } from "../services/api";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingOption, setProcessingOption] = useState([]);
  const [processedImage, setProcessedImage] = useState(null);
  const [status, setStatus] = useState(Status.welcome);

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

      const res = await uploadImage(selectedFile);

      // giả sử backend trả về url
      const imageUrl = res.url || selectedImage;

      setProcessedImage(imageUrl);

      // lưu localStorage
      const existing = JSON.parse(
        localStorage.getItem("uploadedImages") || "[]",
      );

      const record = {
        id: Date.now(),
        url: imageUrl,
        options: processingOption,
        date: new Date().toISOString(),
        reported: false,
      };

      console.log("Saving record to history:", record);

      existing.unshift(record);
      localStorage.setItem("uploadedImages", JSON.stringify(existing));

      setStatus(Status.completed);
    } catch (err) {
      console.error(err);
      setStatus(Status.error);
    }
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
        handleImageChange,
        handleProcessingOptionChange,
        handleUpload,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
