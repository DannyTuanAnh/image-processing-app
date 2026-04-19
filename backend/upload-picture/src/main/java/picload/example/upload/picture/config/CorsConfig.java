package picload.example.upload.picture.config;

import org.apache.catalina.filters.CorsFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;

    @Configuration
    public class CorsConfig {
        @Bean
        public CorsFilter corsFilter()
        {
            CorsConfiguration config = new CorsConfiguration();

            config.setAllowedOrigins(List.of("http://localhost:3000"));
            config.setAllowedHeaders(List.of("*"));
            config.setAllowedMethods(List.of("*"));
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", config);
            return new CorsFilter(source);
    }
    }
