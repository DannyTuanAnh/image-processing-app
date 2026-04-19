package picload.example.upload.picture;

import com.google.cloud.functions.BackgroundFunction;
import com.google.cloud.functions.Context;
import com.google.cloud.storage.*;
import com.google.cloud.vision.v1.*;
import com.google.gson.JsonObject;
import redis.clients.jedis.Jedis;
import java.util.Collections;
import java.util.logging.Logger;

public class ProcessImage implements BackgroundFunction<ProcessImage.GcsEvent> {
    private static final Logger logger = Logger.getLogger(ProcessImage.class.getName());
    private static final Storage storage = StorageOptions.getDefaultInstance().getService();

    // Giả sử Redis được cấu hình qua biến môi trường
    private static final String REDIS_HOST = System.getenv("REDIS_HOST");

    @Override
    public void accept(GcsEvent event, Context context) throws Exception {
        String bucketName = event.bucket;
        String fileName = event.name;

        try (ImageAnnotatorClient visionClient = ImageAnnotatorClient.create()) {
            // 1. Kiểm tra Safe Search
            ImageSource imgSource = ImageSource.newBuilder().setGcsImageUri("gs://" + bucketName + "/" + fileName)
                    .build();
            Image img = Image.newBuilder().setSource(imgSource).build();
            Feature feat = Feature.newBuilder().setType(Feature.Type.SAFE_SEARCH_DETECTION).build();

            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feat)
                    .setImage(img)
                    .build();

            BatchAnnotateImagesResponse response = visionClient.batchAnnotateImages(Collections.singletonList(request));
            SafeSearchAnnotation safeSearch = response.getResponses(0).getSafeSearchAnnotation();

            logger.info(String.format("SafeSearch: Adult:%s, Violence:%s, Racy:%s, Medical:%s, Spoof:%s",
                    safeSearch.getAdultValue(), safeSearch.getViolenceValue(), safeSearch.getRacyValue(),
                    safeSearch.getMedicalValue(), safeSearch.getSpoofValue()));

            // Likelihood >= 3 tương đương POSSIBLE, LIKELY, VERY_LIKELY
            if (safeSearch.getAdultValue() >= 3 || safeSearch.getViolenceValue() >= 3
                    || safeSearch.getRacyValue() >= 3 || safeSearch.getMedicalValue() >= 3) {
                logger.warning("Ảnh vi phạm! Đang xóa...");
                storage.delete(bucketName, fileName);

                notifyViaRedis(fileName, "rejected", "");
                return;
            }

            // 2. Nếu an toàn -> Chuyển sang bucket processed
            String dstBucket = System.getenv("GOOGLE_CLOUD_STORAGE_BUCKET_PROCESSED");
            BlobId sourceId = BlobId.of(bucketName, fileName);
            BlobId destId = BlobId.of(dstBucket, fileName);

            storage.copy(Storage.CopyRequest.newBuilder()
                    .setSource(sourceId)
                    .setTarget(destId)
                    .build());

            storage.delete(sourceId); // Xóa file ở bucket raw

            String finalUrl = String.format("https://googleapis.com", dstBucket, fileName);
            notifyViaRedis(fileName, "approved", finalUrl);
        }
    }

    private void notifyViaRedis(String fileName, String status, String url) {
        String userID = fileName.split("_")[0]; // tên file là userID_uuid

        JsonObject payload = new JsonObject();
        payload.addProperty("user_id", userID);
        payload.addProperty("status", status);
        payload.addProperty("url", url);

        try (Jedis jedis = new Jedis(REDIS_HOST, 6379)) {
            jedis.publish("image_events", payload.toString());
            logger.info("Đã gửi thông báo qua Redis cho user: " + userID);
        } catch (Exception e) {
            logger.severe("Lỗi kết nối Redis: " + e.getMessage());
        }
    }

    public static class GcsEvent {
        String bucket;
        String name;
    }
}