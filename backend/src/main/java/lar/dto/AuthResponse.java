package lar.dto;

/**
 * Returned by POST /auth/login and POST /auth/register (on success).
 * Contains the JWT token and enough metadata for the frontend to
 * set up role-based routing without decoding the token itself.
 */
public class AuthResponse {

    private String token;
    private String role;
    private String email;

    public AuthResponse(String token, String role, String email) {
        this.token = token;
        this.role  = role;
        this.email = email;
    }

    public String getToken() { return token; }
    public String getRole()  { return role;  }
    public String getEmail() { return email; }
}
