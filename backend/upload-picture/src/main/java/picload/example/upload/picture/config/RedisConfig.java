package picload.example.upload.picture.config;

import io.lettuce.core.ClientOptions;
import io.lettuce.core.SocketOptions;
import io.lettuce.core.protocol.ProtocolVersion;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        String host = System.getenv().getOrDefault("SPRING_DATA_REDIS_HOST", "10.71.176.139");
        int port = Integer.parseInt(System.getenv().getOrDefault("SPRING_DATA_REDIS_PORT", "6379"));
        String password = System.getenv("SPRING_DATA_REDIS_PASSWORD");

        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration(host, port);

        if (password != null && !password.isBlank()) {
            redisConfig.setPassword(RedisPassword.of(password));
        }

        LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
                .commandTimeout(Duration.ofSeconds(5))
                .shutdownTimeout(Duration.ZERO)
                .clientOptions(ClientOptions.builder()
                        .protocolVersion(ProtocolVersion.RESP2) // QUAN TRỌNG
                        .socketOptions(SocketOptions.builder()
                                .connectTimeout(Duration.ofSeconds(5))
                                .build())
                        .build())
                .build();

        return new LettuceConnectionFactory(redisConfig, clientConfig);
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(RedisConnectionFactory connectionFactory) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setRecoveryInterval(5000);
        return container;
    }
}