package picload.example.upload.picture.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;
import picload.example.upload.picture.sse.SseBroker;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class RedisResultsListener {

    private static final String CHANNEL = "image-processing-results";

    private final RedisMessageListenerContainer container;
    private final SseBroker broker;
    private final ObjectMapper objectMapper;

    @EventListener(ApplicationReadyEvent.class)
    public void start() {
        log.info("RedisResultsListener.start() invoked");
        String redisKey = System.getenv("REDIS_KEY_PAYLOAD");
        if (redisKey == null || redisKey.isBlank()) {
            log.warn("REDIS_KEY_PAYLOAD missing -> Redis listener disabled (app will still start).");
            return;
        }

        SecretKey key = Keys.hmacShaKeyFor(redisKey.getBytes(StandardCharsets.UTF_8));

        container.addMessageListener(new MessageListener() {
            @Override
            public void onMessage(Message message, byte[] pattern) {
                String payloadJwt = new String(message.getBody(), StandardCharsets.UTF_8);
                log.info("Received message from Redis: {}", payloadJwt);

                try {
                    Claims claims = Jwts.parser()
                            .verifyWith(key)
                            .build()
                            .parseSignedClaims(payloadJwt)
                            .getPayload();

                    Map<String, Object> payload = new HashMap<>();
                    payload.put("user_id", claims.get("user_id"));
                    payload.put("status", claims.get("status"));
                    payload.put("file_path", claims.get("file_path"));

                    String json = objectMapper.writeValueAsString(payload);
                    broker.broadcast(json);
                } catch (Exception e) {
                    log.warn("Invalid JWT or payload. Skipped. {}", e.getMessage());
                }
            }
        }, new ChannelTopic(CHANNEL));

        log.info("Redis listener subscribed to channel: {}", CHANNEL);
    }
}