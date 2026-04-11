export const Status = {
  welcome: {
    message: "Chào mừng bạn đến với Image Processor!",
    color: "text-blue-600",
  },
  upload: {
    message: "Ảnh đã được chọn. Vui lòng chọn tùy chọn xử lý.",
    color: "text-green-600",
  },
  clickedOption: {
    message:
      "Bạn đã chọn một tùy chọn xử lý. Hãy click vào nút upload để bắt đầu xử lý.",
    color: "text-gray-600",
  },
  processing: {
    message: "Đang xử lý ảnh...",
    color: "text-yellow-600",
  },
  completed: {
    message: "Xử lý ảnh hoàn tất!",
    color: "text-green-600",
  },
};

export const ProcessingOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];
