package picload.example.upload.picture;

import com.google.cloud.functions.CloudEventsFunction;
import com.google.cloud.storage.*;
import com.google.cloud.vision.v1.*;
import com.google.gson.JsonObject;

import io.cloudevents.CloudEvent;
import redis.clients.jedis.Jedis;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.logging.Logger;

public class ProcessImage implements CloudEventsFunction {
    private static final Logger logger = Logger.getLogger(ProcessImage.class.getName());
    private static final Storage storage = StorageOptions.getDefaultInstance().getService();

    // Redis host from environment variable
    private static final String REDIS_HOST = System.getenv("REDIS_HOST");

    @Override
    public void accept(CloudEvent event) throws Exception {
        String cloudEventData = new String(event.getData().toBytes(), StandardCharsets.UTF_8);
        JsonObject data = com.google.gson.JsonParser.parseString(cloudEventData).getAsJsonObject();

        String bucketName = data.get("bucket").getAsString();
        String fileName = data.get("name").getAsString();

        logger.info("Processing file: " + fileName + " from bucket: " + bucketName);

        try (ImageAnnotatorClient visionClient = ImageAnnotatorClient.create()) {
            // 1. Check Safe Search
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

            // Likelihood >= 3 <=> POSSIBLE, LIKELY, VERY_LIKELY
            if (safeSearch.getAdultValue() >= 3 || safeSearch.getViolenceValue() >= 3
                    || safeSearch.getRacyValue() >= 3 || safeSearch.getMedicalValue() >= 3) {
                logger.warning("Violation detected! Deleting...");
                storage.delete(bucketName, fileName);

                notifyViaRedis(fileName, "rejected", "");
                return;
            }

            // 2. if safe -> Move to processed bucket
            String dstBucket = System.getenv("GOOGLE_CLOUD_STORAGE_BUCKET_PROCESSED");
            BlobId sourceId = BlobId.of(bucketName, fileName);
            BlobId destId = BlobId.of(dstBucket, fileName);

            storage.copy(Storage.CopyRequest.newBuilder()
                    .setSource(sourceId)
                    .setTarget(destId)
                    .build());

            storage.delete(sourceId); // delete file in raw bucket

            String finalUrl = String.format("https://image-frontend.duckdns.org/", dstBucket, fileName);
            notifyViaRedis(fileName, "approved", finalUrl);
        }
    }

    private void notifyViaRedis(String fileName, String status, String url) {
        String userID = fileName.split("_")[0]; // file name is userID_uuid

        JsonObject payload = new JsonObject();
        payload.addProperty("user_id", userID);
        payload.addProperty("status", status);
        payload.addProperty("url", url);

        try (Jedis jedis = new Jedis(REDIS_HOST, 6379)) {
            jedis.publish("image_events", payload.toString());
            logger.info("Notification sent to Redis for user: " + userID);
        } catch (Exception e) {
            logger.severe("Connecting error Redis: " + e.getMessage());
        }
    }
}
