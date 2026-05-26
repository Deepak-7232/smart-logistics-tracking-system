package lar.config;

import lar.filter.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ── Public ─────────────────────────────────────────────────
                        .requestMatchers("/auth/**").permitAll()

                        // ── DRIVER + ADMIN shared endpoints ─────────────────────────
                        .requestMatchers(HttpMethod.GET, "/shipments/my-shipments/**")
                        .hasAnyRole("ADMIN", "DRIVER")
                        .requestMatchers(HttpMethod.PUT, "/shipments/update-status/**")
                        .hasAnyRole("ADMIN", "DRIVER")
                        // Driver self-profile (for My Vehicle + availability toggle)
                        .requestMatchers(HttpMethod.GET, "/drivers/me/**")
                        .hasAnyRole("ADMIN", "DRIVER")
                        // Availability toggle — both ADMIN (assigning) and DRIVER (self-toggle)
                        .requestMatchers(HttpMethod.PUT, "/drivers/availability/**")
                        .hasAnyRole("ADMIN", "DRIVER")

                        // ── ADMIN only: shipment management ─────────────────────────
                        .requestMatchers(HttpMethod.GET, "/shipments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/shipments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/shipments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/shipments/**").hasRole("ADMIN")

                        // ── ADMIN only: driver management ────────────────────────────
                        .requestMatchers(HttpMethod.GET, "/drivers/all").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/drivers/**").hasRole("ADMIN")

                        // ── ADMIN only: vehicle management ───────────────────────────
                        .requestMatchers("/vehicles/**").hasRole("ADMIN")

                        // ── Everything else requires authentication ──────────────────
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated())
                .formLogin(form -> form.disable())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}