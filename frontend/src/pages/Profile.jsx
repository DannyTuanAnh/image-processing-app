import { useEffect, useState } from "react";
import { Flag, Trash2 } from "lucide-react";

export default function Profile() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("uploadedImages") || "[]");
      setItems(saved);
    } catch (err) {
      console.error("Failed to load uploaded images", err);
    }
  }, []);

  const toggleReport = (id) => {
    setItems((prev) => {
      const next = prev.map((it) =>
        it.id === id ? { ...it, reported: !it.reported } : it,
      );
      try {
        localStorage.setItem("uploadedImages", JSON.stringify(next));
      } catch (err) {
        console.error("Failed to update report state", err);
      }
      return next;
    });
  };

  const clearHistory = () => {
    if (!confirm("Xác nhận xóa toàn bộ lịch sử tải lên?")) return;
    localStorage.removeItem("uploadedImages");
    setItems([]);
  };

  return (
    <div className="mt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Lịch sử ảnh đã tải lên</h1>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 flex items-center gap-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={clearHistory}
            >
              <Trash2 size={16} className="inline-block" />
              Xóa lịch sử
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Chưa có ảnh nào được tải lên.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                  <img
                    src={it.url}
                    alt="uploaded"
                    className="object-contain h-full w-full"
                  />
                  <button
                    className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded ${
                      it.reported
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-800 text-white"
                    }`}
                    onClick={() => toggleReport(it.id)}
                    title={it.reported ? "Đã báo cáo" : "Báo cáo"}
                  >
                    <Flag size={16} />
                    <span className="text-sm">
                      {it.reported ? "Đã báo" : "Báo"}
                    </span>
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-600 mb-1">
                    Tùy chọn: {it.options?.join(", ") || "-"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(it.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
