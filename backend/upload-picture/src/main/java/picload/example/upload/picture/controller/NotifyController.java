package picload.example.upload.picture.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import picload.example.upload.picture.sse.SseBroker;

import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
@Slf4j
public class NotifyController {

    private final SseBroker broker;

    @GetMapping(value = "/sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter sse() throws IOException {
        SseEmitter emitter = broker.addClient();

        // initial chunk
        emitter.send(SseEmitter.event().comment("connected"));

        // heartbeat (ping) every 5s
        var scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(() -> {
            try {
                emitter.send(SseEmitter.event().comment("ping"));
            } catch (Exception e) {
                scheduler.shutdown();
            }
        }, 5, 5, TimeUnit.SECONDS);

        emitter.onCompletion(scheduler::shutdown);
        emitter.onTimeout(scheduler::shutdown);
        emitter.onError(e -> scheduler.shutdown());

        log.info("SSE client connected. Total: {}", broker.clientCount());
        return emitter;
    }
}