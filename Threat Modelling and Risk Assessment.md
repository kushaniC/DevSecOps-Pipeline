# Member 2 Tasks – Threat Modelling & Risk Assessment

## 1. Threat Modelling Approach

The project uses the **STRIDE** threat modelling methodology.

STRIDE is used to identify application-specific security threats across the selected architecture.

The six STRIDE categories are:

### Spoofing
An attacker pretends to be another user or system component.

### Tampering
An attacker modifies data, requests, code or other information without authorization.

### Repudiation
An actor performs an action and later denies performing it where adequate evidence or logging is not available.

### Information Disclosure
Sensitive or confidential information is exposed to an unauthorized party.

### Denial of Service
An attacker causes the application or service to become unavailable or significantly degraded.

### Elevation of Privilege
An attacker gains permissions or access beyond what their account should have.

## 2. Scope of the Threat Model

The threat model covers:

- User browser.
- Nginx frontend.
- Juice Shop backend.
- Application data/storage.
- Docker networks.
- GitHub repository.
- GitHub Actions CI/CD pipeline.
- Security scanning tools.
- Runtime secrets.

The main trust boundaries are the public browser-to-application boundary, the Nginx-to-backend boundary, the internal data boundary, and the CI/CD boundary.

## 3. Threat 1 – Information Disclosure Through Exposed FTP Directory

### STRIDE Category
Information Disclosure.

### Threat

The original application exposed the `/ftp` directory to users.

An unauthenticated user could navigate to `/ftp` and receive a directory listing containing internal files.

This allowed an attacker to enumerate files that were not intended to be publicly listed.

### Likelihood
High — proposed rating: 4/5.

### Impact
High — proposed rating: 4/5.

### Risk
16/25 using Likelihood × Impact.

### Control

The directory-index middleware was removed from the vulnerable implementation. The `/ftp` base path was changed to explicitly return `403 Forbidden`.

### Control Location

`server.ts`

### Expected Result

An attacker should no longer receive a directory listing when accessing `/ftp`.

## 4. Threat 2 – IDOR on User Baskets

### STRIDE Category
Elevation of Privilege.

### Threat

The original basket endpoint allowed an authenticated user to request another user's basket by changing the basket ID.

An authenticated User B could request User A's basket ID, and the application returned the requested basket without properly verifying ownership.

### Likelihood
High — proposed rating: 4/5.

### Impact
High — proposed rating: 4/5.

### Risk
16/25 using Likelihood × Impact.

### Control

An ownership authorization check was added. The application compares the authenticated user's ID with the requested basket's owner ID. If they do not match, the application returns `403 Forbidden`.

### Control Location

`routes/basket.ts`

### Expected Result

User B should not be able to access User A's basket.

## 5. Threat 3 – Sensitive Information Disclosure Through JWT

### STRIDE Category
Information Disclosure.

### Threat

The original JWT payload contained sensitive information from the database user object, including the user's password hash and internal Sequelize/ORM data.

Because the JWT is available on the client side, information placed inside the payload can be inspected by the client.

### Likelihood
High — proposed rating: 4/5.

### Impact
High — proposed rating: 4/5.

### Risk
16/25 using Likelihood × Impact.

### Control

The `authorize()` function was changed to construct a restricted `safePayload`.

The payload contains only required non-sensitive fields such as:

- ID
- Email
- Role
- Profile image

Sensitive password information and internal ORM data are excluded.

### Control Location

`lib/insecurity.ts`

### Expected Result

The JWT payload should contain only the intended user metadata.

## 6. Threat 4 – Hardcoded JWT RSA Private Key

### STRIDE Category
Tampering / Elevation of Privilege.

### Threat

The original application contained the RSA private key used to sign JWT tokens directly in the source code.

Anyone who obtained the source code could obtain the signing key. An attacker with the signing key could potentially create forged JWT tokens.

### Likelihood
Medium — proposed rating: 3/5.

### Impact
Very High — proposed rating: 5/5.

### Risk
15/25 using Likelihood × Impact.

### Control

The hardcoded RSA key was removed.

The application now reads the key from:

`process.env.JWT_PRIVATE_KEY`

The key can therefore be supplied through the runtime environment rather than stored in source code.

### Control Location

`lib/insecurity.ts`

`docker-compose.yml`

GitHub Actions secrets configuration.

### Expected Result

The RSA private key should not appear as a source-code literal.


### Control

Use:

- Environment variables for runtime secrets.
- GitHub Actions encrypted secrets for CI/CD.
- Gitleaks to detect accidentally committed secrets.
- `.env.example` containing variable names but not real secret values.
- `.gitignore` to prevent local secret files from being committed.

### Control Location

`lib/insecurity.ts`

`docker-compose.yml`

`.github/workflows/CI CD Pipeline.yml`

`.env.example`

## 8. Threat-to-Control Reasoning

### T1 – FTP Directory Listing

Threat: Public users can enumerate internal files.

Control: Remove directory indexing and return 403.

### T2 – Basket IDOR

Threat: One authenticated user can access another user's basket.

Control: Verify basket ownership before returning the data.

### T3 – Sensitive JWT Data

Threat: The client receives password hashes and internal ORM data.

Control: Create a strict safe JWT payload containing only required fields.

### T4 – RSA Private Key

Threat: A leaked signing key can potentially be used to forge authentication tokens.

Control: Inject the private key through an environment variable/runtime secret.



## 9. Risk Assessment Method

A 5×5 matrix can be used.

Likelihood:

1 = Very Low  
2 = Low  
3 = Medium  
4 = High  
5 = Very High

Impact:

1 = Very Low  
2 = Low  
3 = Medium  
4 = High  
5 = Very High

Risk is calculated as:

Risk = Likelihood × Impact

The numerical ratings are project assessments and should be reviewed by the group before final submission so that every member can explain why the chosen values are reasonable.
