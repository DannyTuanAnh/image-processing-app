export default function Gallery({ processedImage }){
    return (
        <div className="w-6xl bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Hình ảnh đã xử lý</h2>
            <div className="flex items-center justify-center h-64 border-2 border-gray-300 rounded-lg p-4">
              {processedImage ? (
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              ) : (
                <p className="text-gray-400">
                  Hình ảnh đã xử lý sẽ xuất hiện ở đây
                </p>
              )}
            </div>
          </div>
    )
}