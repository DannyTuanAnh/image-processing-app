import ImagePreview from "../components/ImagePreview";
import UploadForm from "../components/UploadForm";
import Gallery from "../components/Gallery";
import { useUpload } from "../context/UploadContext";

function Home() {
  const {
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
  } = useUpload();

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
