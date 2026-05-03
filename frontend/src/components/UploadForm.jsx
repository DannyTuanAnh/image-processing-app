import { Upload, Wand2, RotateCcw } from "lucide-react";
import { Status, ProcessingOptions } from "../utils/constant";

export default function UploadForm({
  processingOption,
  setProcessingOption,
  setStatus,
  handleProcessingOptionChange,
  handleUpload,
  handleImageChange,
  status,
  setProcessedImage,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Tùy chọn xử lý</h2>

        <p className="text-slate-400 text-sm mt-1">
          Chọn các chức năng muốn áp dụng cho hình ảnh.
        </p>
      </div>

      <div className="space-y-6">
        <form className="space-y-4">
          {ProcessingOptions.length > 0 &&
            ProcessingOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-black/20 hover:bg-white/5 transition-all duration-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={option.value}
                  value={option.value}
                  checked={processingOption.includes(option.value)}
                  onChange={handleProcessingOptionChange}
                  className="h-5 w-5 accent-blue-500"
                />

                <span className="text-slate-200 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
        </form>

        <button
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-slate-200"
          onClick={() => {
            setProcessingOption([]);
            setProcessedImage(null);
            setStatus(Status.clickedOption);
          }}
        >
          <RotateCcw size={18} />
          Làm mới tùy chọn
        </button>

        <label className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-all duration-300 cursor-pointer border border-white/10 text-white font-medium">
          <Upload size={18} />
          <input type="file" className="hidden" onChange={handleImageChange} />
          Chọn ảnh để xử lý
        </label>

        <button
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-semibold shadow-lg shadow-blue-500/20"
          onClick={handleUpload}
        >
          <Wand2 size={18} />
          Tải lên và xử lý
        </button>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className={`${status.color} text-sm font-medium`}>
            {status.message}
          </p>
        </div>
      </div>
    </div>
  );
}
