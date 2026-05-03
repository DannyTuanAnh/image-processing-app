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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 text-white">
      <div className="max-w-7xl mx-auto space-y-10 mt-16">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur">
            <span className="text-sm text-slate-300">AI Image Processing</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Xử lý hình ảnh hiện đại
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Tải ảnh lên, chọn tùy chọn xử lý và nhận kết quả với giao diện tối
            giản, hiện đại và tối ưu trải nghiệm người dùng.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
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
    </div>
  );
}

export default Home;
