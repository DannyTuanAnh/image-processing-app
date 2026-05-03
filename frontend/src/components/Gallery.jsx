import { Image as ImageIcon } from "lucide-react";

export default function Gallery({ processedImage }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Hình ảnh đã xử lý</h2>
          <p className="text-slate-400 text-sm mt-1">
            Kết quả xử lý sẽ hiển thị tại đây.
          </p>
        </div>
      </div>

      <div className="min-h-[420px] rounded-2xl border border-dashed border-white/10 bg-black/20 flex items-center justify-center overflow-hidden">
        {processedImage ? (
          <img
            src={processedImage}
            alt="Processed"
            className="max-h-[500px] max-w-full object-contain rounded-2xl shadow-2xl"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-500">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <ImageIcon size={48} />
            </div>

            <p className="text-lg">Hình ảnh đã xử lý sẽ xuất hiện ở đây</p>
          </div>
        )}
      </div>
    </div>
  );
}
