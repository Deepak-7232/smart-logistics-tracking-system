package lar.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

/**
 * JWT Service — uses JJWT 0.12.x API (no deprecated methods).
 *
 * JJWT 0.12.x changes:
 *  - Keys.hmacShaKeyFor() now returns SecretKey (not Key)
 *  - Jwts.builder() uses .subject(), .issuedAt(), .expiration() (not set* prefixed)
 *  - Jwts.parser() replaces the removed Jwts.parserBuilder()
 *  - SignatureAlgorithm enum is gone — use Jwts.SIG.HS256 (MacAlgorithm)
 */
@Service
public class JwtService {

    private final String SECRET_KEY =
            "mysecretkeymysecretkeymysecretkeymysecretkey";

    // SecretKey (javax.crypto) — correct type for JJWT 0.12.x
    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    // ── Token generation ──────────────────────────────────────────────────────

    /**
     * Generate a JWT that embeds the user's role as a custom claim.
     * Token is valid for 1 hour.
     *
     * JJWT 0.12.x uses method names WITHOUT the "set" prefix:
     *   .subject()    instead of .setSubject()
     *   .issuedAt()   instead of .setIssuedAt()
     *   .expiration() instead of .setExpiration()
     *   .signWith(key) — algorithm inferred from key type
     */
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60))
                .signWith(key)                  // algorithm auto-selected (HS256 for HMAC-256-bit key)
                .compact();
    }

    // ── Token validation ──────────────────────────────────────────────────────

    public boolean isTokenValid(String token) {
        try {
            return !extractExpiration(token).before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // ── Claim extraction ──────────────────────────────────────────────────────

    /** Extract the subject (email) from the token. */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)            // replaces .setSigningKey(key).build()
                .build()
                .parseSignedClaims(token)   // replaces .parseClaimsJws(token)
                .getPayload();              // replaces .getBody()
    }
}