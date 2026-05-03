import { useUpload } from "../context/UploadContext";
import { Flag, Trash2, X, Image as ImageIcon } from "lucide-react";

export default function Profile() {
  const { items, clearHistory, toggleReport, handleDelete } = useUpload();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 text-white">
      <div className="max-w-7xl mx-auto mt-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Lịch sử hình ảnh
            </h1>
            <p className="text-slate-400 mt-1">
              Quản lý toàn bộ ảnh đã tải lên và xử lý.
            </p>
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/90 hover:bg-red-500 transition-all duration-300 shadow-lg shadow-red-500/20"
            onClick={clearHistory}
          >
            <Trash2 size={18} />
            Xóa lịch sử
          </button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-14 text-center">
            <div className="flex flex-col items-center gap-4 text-slate-400">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <ImageIcon size={42} />
              </div>

              <div>
                <p className="text-lg font-medium text-slate-200">
                  Chưa có hình ảnh nào
                </p>
                <p className="text-sm mt-1">
                  Những ảnh bạn tải lên sẽ xuất hiện tại đây.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((it) => (
              <div
                key={it.id}
                className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-64 bg-black/30 overflow-hidden">
                  <img
                    src={it.url}
                    alt="uploaded"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      className={`backdrop-blur-md border transition-all duration-300 px-3 py-2 rounded-xl flex items-center gap-1 text-sm ${
                        it.reported
                          ? "bg-yellow-400 text-black border-yellow-300"
                          : "bg-black/40 text-white border-white/10 hover:bg-black/60"
                      }`}
                      onClick={() => toggleReport(it.id)}
                      title={it.reported ? "Đã báo cáo" : "Báo cáo"}
                    >
                      <Flag size={16} />
                      {it.reported ? "Đã báo" : "Báo"}
                    </button>

                    <button
                      className="bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-xl transition-all duration-300"
                      onClick={() => handleDelete(it.id)}
                      title="Xóa ảnh"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">
                      Tùy chọn xử lý
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {it.options?.length > 0 ? (
                        it.options.map((op, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs"
                          >
                            {op}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">-</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-slate-500">
                      {new Date(it.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
