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
    <div className="flex justify-between items-start space-x-8 w-full">
      <form className="bg-white rounded-lg shadow-md p-4 space-y-4 flex flex-col min-w-[300px]">
        <p className="text-lg font-semibold">Tùy chọn xử lý</p>
        {ProcessingOptions.length > 0 &&
          ProcessingOptions.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                name={option.value}
                value={option.value}
                checked={processingOption.includes(option.value)}
                onChange={handleProcessingOptionChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 mt-2"
          onClick={() => {
            setProcessingOption([]);
            setProcessedImage(null);
            setStatus(Status.clickedOption);
          }}
        >
          làm mới tùy chọn
        </button>
      </form>

      <div className="flex flex-col gap-4 flex-1">
        <label className="flex flex-col items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300 cursor-pointer">
          <input type="file" className="hidden" onChange={handleImageChange} />
          Chọn ảnh để xử lý
        </label>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          onClick={handleUpload}
        >
          Tải lên và xử lý
        </button>
        <div className="bg-white p-4 rounded">
          <p className={status.color}>{status.message}</p>
        </div>
      </div>
    </div>
  );
}
