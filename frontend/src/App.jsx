import "./App.css";
import { useState } from "react";
import ImagePreview from "./components/ImagePreview";
import UploadForm from "./components/UploadForm";
import Gallery from "./components/Gallery";
import { Status, ProcessingOptions } from "./utils/constant";

function App() {
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
        setProcessedImage(selectedImage); // In a real app, this would be the processed image URL
        setStatus(Status.completed);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <header className="h-16 fixed inset-0 flex items-center justify-center border-b border-gray-300 bg-white w-full">
        <h1 className="text-2xl font-bold">Image Processor</h1>
      </header>
      <main className="w-full flex-1 overflow-auto py-8">
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
      </main>
      <footer className="h-16 flex items-center justify-center border-t border-gray-300 bg-white w-full">
        <p className="text-sm text-gray-500">
          &copy; 2024 Image Processor. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
