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

        emitter.onCompletion(() -> clients.remove(emitter));
        emitter.onTimeout(() -> clients.remove(emitter));
        emitter.onError(e -> clients.remove(emitter));

        return emitter;
    }

    public void broadcast(String data) {
        for (SseEmitter emitter : clients) {
            try {
                emitter.send(SseEmitter.event().name("message").data(data));
            } catch (IOException ex) {
                clients.remove(emitter);
            }
        }
        log.info("Broadcasted to {} SSE client(s)", clients.size());
    }

    public int clientCount() {
        return clients.size();
    }
}