# SAST Before and After Comparison

## Tool

Semgrep was used as the Static Application Security Testing (SAST) tool.

Semgrep version:

1.178.0

The same Semgrep command and OWASP Top 10 ruleset were used for both scans:

```bash
semgrep --config=p/owasp-top-ten --json
```

## Before Remediation

The baseline scan was performed against commit:

`df19bca`

This commit represents the original application before the four selected security fixes.

Results:

- Files scanned: 996
- Rules run: 180
- Findings: 45
- Blocking findings: 45

The raw result is stored in:

`semgrep-before.json`

## After Remediation

The post-remediation scan was performed against commit:

`d614968`

Results:

- Files scanned: 983
- Rules run: 180
- Findings: 35
- Blocking findings: 35

The raw result is stored in:

`semgrep-after.json`

## Overall Difference

The total number of Semgrep findings decreased from 45 before remediation to 35 after remediation.

Difference:

10 fewer findings.

This represents a 22.2% reduction in the total number of reported findings.

The reduction should not be attributed entirely to the four selected vulnerabilities because the repository changed between the two scanned commits and the OWASP Juice Shop source contains additional security challenge and supporting code.

## Relationship to the Four Selected Vulnerabilities

### Vulnerability 1 - FTP Directory Listing

Semgrep reported directory-listing findings in `server.ts` in the pre-remediation scan.

The specific `/ftp` exposure was removed as part of the security fix. Other directory-listing routes remained in the application, so the remaining Semgrep directory-listing findings cannot be treated as proof that the `/ftp` issue remains.

The `/ftp` vulnerability is therefore primarily validated through the exploit-before, fix, and exploit-after evidence.

### Vulnerability 2 - Basket IDOR

No Semgrep finding was reported for `routes/basket.ts` in the before or after scan.

The IDOR vulnerability is therefore validated through manual exploitation and retesting. The original exploit demonstrated unauthorized access to another user's basket, while the fixed application performs an ownership check and rejects unauthorized access.

### Vulnerability 3 - Sensitive JWT Information

The pre-remediation scan reported a JWT-related finding in:

`lib/insecurity.ts`

at line 54.

The finding was:

`javascript.jsonwebtoken.security.jwt-hardcode.hardcoded-jwt-secret`

This finding was not present in the post-remediation relevant results.

However, this Semgrep rule is specifically related to a hardcoded JWT secret and should not be presented as direct detection of the sensitive JWT payload vulnerability.

The sensitive JWT payload issue is primarily validated through inspection of the JWT before and after the fix.

### Vulnerability 4 - Hardcoded RSA Private Key

No direct Semgrep finding corresponding specifically to the hardcoded RSA private key was identified in the selected before/after results.

The vulnerability is therefore validated through code inspection, the original vulnerable implementation, removal of the hardcoded private key, and verification that the key is obtained from environment-based secret configuration.

## SAST Evidence

The raw Semgrep JSON results are included in this directory:

- `semgrep-before.json`
- `semgrep-after.json`

These files provide the raw evidence for the reported SAST counts.
