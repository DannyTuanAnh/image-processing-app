import { Image, X } from "lucide-react";
import { Status } from "../utils/constant";

export default function ImagePreview({
  selectedImage,
  setSelectedImage,
  setStatus,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Ảnh xem trước</h2>
          <p className="text-slate-400 text-sm mt-1">
            Xem nhanh hình ảnh trước khi xử lý.
          </p>
        </div>
      </div>

      <div className="min-h-[500px] min-w-full flex items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 overflow-hidden">
        {selectedImage ? (
          <div className="relative w-full h-full flex items-center justify-center p-6">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-[500px] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              className="absolute top-4 right-4 bg-black/60 hover:bg-red-500 text-white rounded-xl p-2 transition-all duration-300 backdrop-blur-md"
              onClick={() => {
                setSelectedImage(null);
                setStatus(Status.welcome);
              }}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-500">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <Image size={52} />
            </div>

            <p className="mt-4 text-lg">Không có ảnh nào được chọn</p>
          </div>
        )}
      </div>
    </div>
  );
}
