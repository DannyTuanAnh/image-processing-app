package picload.example.upload.picture.exception;

public enum ErrorCode {
    UNCATEGORIZED(9999, "Uncategorized"),
    WRONG_TYPE_OF_PIC(1001, "Only PNG/JPG allowed");
    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
