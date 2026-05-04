package picload.example.upload.picture.sse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class SseBroker {

    private final Set<SseEmitter> clients = ConcurrentHashMap.newKeySet();

    public SseEmitter addClient() {
        SseEmitter emitter = new SseEmitter(0L); // no timeout
        clients.add(emitter);

        emitter.onCompletion(() -> {
            clients.remove(emitter);
            log.info("SSE client disconnected. Total: {}", clients.size());
        });
        emitter.onTimeout(() -> {
            clients.remove(emitter);
            log.info("SSE client timeout. Total: {}", clients.size());
        });

        emitter.onError(e -> {
            clients.remove(emitter);
            log.warn("SSE client error: {}. Total: {}", e.getMessage(), clients.size());
        });

        return emitter;
    }

    public void broadcast(String data) {
        clients.removeIf(emitter -> {
            try {
                // IMPORTANT:
                // send default SSE event => frontend receives via es.onmessage
                emitter.send(SseEmitter.event().data(data));
                return false;
            } catch (IOException ex) {
                log.warn("Removing dead SSE client: {}", ex.getMessage());
                return true;
            }
        });

        log.info("Broadcasted to {} SSE client(s): {}", clients.size(), data);
    }

    public int clientCount() {
        return clients.size();
    }
}