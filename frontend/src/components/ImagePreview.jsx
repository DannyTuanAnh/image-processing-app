import { Image, X } from "lucide-react";
import { Status } from "../utils/constant";
export default function ImagePreview({
  selectedImage,
  setSelectedImage,
  setStatus,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 ">
      <div className="flex items-center justify-center h-64 min-w-[500px]">
        {selectedImage ? (
          <div className="relative w-full h-full">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-full max-w-full object-contain rounded-lg mx-auto"
            />
            <button
              className="absolute top-0.5 right-2 bg-gray-500 text-white rounded-full p-1 hover:bg-gray-600 transition duration-300"
              onClick={() => {
                setSelectedImage(null);
                setStatus(Status.welcome);
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-8">
            <Image size={48} />
            <p className="mt-2">không có ảnh nào được chọn</p>
          </div>
        )}
      </div>
    </div>
  );
}
