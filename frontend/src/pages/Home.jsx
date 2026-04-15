import { useState } from "react";
import ImagePreview from "../components/ImagePreview";
import UploadForm from "../components/UploadForm";
import Gallery from "../components/Gallery";
import { Status } from "../utils/constant";

function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingOption, setProcessingOption] = useState([]);
  const [processedImage, setProcessedImage] = useState(null);
  const [status, setStatus] = useState(Status.welcome);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setStatus(Status.upload);
    }
  };

  const handleProcessingOptionChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setProcessingOption((prev) => [...prev, value]);
      setStatus(Status.clickedOption);
    } else {
      setProcessingOption((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleUpload = () => {
    if (selectedImage && processingOption.length > 0) {
      setStatus(Status.processing);
      // Simulate processing time
      setTimeout(() => {
        // In a real app, this would be the processed image URL
        setProcessedImage(selectedImage);
        // Save upload record to localStorage for profile history
        try {
          const existing = JSON.parse(
            localStorage.getItem("uploadedImages") || "[]",
          );
          const record = {
            id: Date.now(),
            url: selectedImage,
            options: processingOption,
            date: new Date().toISOString(),
            reported: false,
          };
          console.log("Saving upload record", record);
          existing.unshift(record);
          localStorage.setItem("uploadedImages", JSON.stringify(existing));
        } catch (err) {
          console.error("Failed to save upload record", err);
        }
        setStatus(Status.completed);
      }, 2000);
    }
  };

  return (
    <div className="space-y-8 mt-20 flex flex-col items-center justify-center">
      <div className="flex justify-between items-start space-x-8 w-6xl">
        <ImagePreview
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setStatus={setStatus}
        />

        <UploadForm
          processingOption={processingOption}
          setProcessingOption={setProcessingOption}
          setStatus={setStatus}
          handleProcessingOptionChange={handleProcessingOptionChange}
          handleUpload={handleUpload}
          handleImageChange={handleImageChange}
          status={status}
          setProcessedImage={setProcessedImage}
        />
      </div>
      <Gallery processedImage={processedImage} />
    </div>
  );
}

export default Home;
