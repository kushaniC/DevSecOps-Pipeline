# DevSecOps Pipeline – OWASP Juice Shop

## Project Overview

This project implements a DevSecOps pipeline for the OWASP Juice Shop
application as part of the IE3142 – DevOps Security module.

The project demonstrates how security can be integrated throughout the
software development lifecycle using secure coding, vulnerability
remediation, automated security scanning, containerisation, secrets
management, and CI/CD security gates.

## Application Architecture

The application consists of two main services:

- **Nginx** – acts as the frontend/reverse proxy and receives external
  requests.
- **OWASP Juice Shop** – Node.js/Express backend application.

Nginx forwards requests to the Juice Shop backend through the internal
Docker network.

### Architecture Flow

Client
  |
  v
Nginx
  |
  v
Juice Shop Backend
  |
  v
Internal Docker Network

## Technology Stack

| Component | Technology |
|---|---|
| Application | OWASP Juice Shop |
| Backend | Node.js / Express |
| Reverse Proxy | Nginx |
| Containerisation | Docker |
| Orchestration | Docker Compose |
| CI/CD | GitHub Actions |
| SAST | Semgrep |
| Dependency Scanning | npm audit |
| Secret Scanning | Gitleaks |
| Container Scanning | Trivy |

## Security Vulnerabilities Remediated

Four application-specific vulnerabilities were selected for
exploit-and-fix demonstrations:

1. Exposed FTP Directory Listing
2. IDOR in User Baskets
3. Sensitive Information in JWT Payload
4. Hardcoded RSA Private Key

Each vulnerability was demonstrated against the vulnerable
implementation, fixed using secure coding practices, and tested again
after remediation.

## Security Controls

### 1. Semgrep – SAST

Semgrep performs static application security testing against the source
code.

### 2. npm audit – Dependency Scanning

npm audit checks third-party Node.js dependencies for known security
vulnerabilities.

### 3. Gitleaks – Secret Scanning

Gitleaks detects accidentally committed credentials, private keys,
passwords, and other sensitive information.

### 4. Trivy – Container Image Scanning

Trivy scans the built Docker image for known vulnerabilities in
operating-system packages and application dependencies.

## CI/CD Pipeline

GitHub Actions automates the security validation process.

The pipeline performs:

1. Application build
2. Semgrep SAST
3. npm audit dependency scanning
4. Gitleaks secret scanning
5. Docker image build
6. Trivy container image scanning

Security gates are configured to fail the workflow when configured
security thresholds are exceeded.

A Gitleaks blocking test was also performed by deliberately introducing
a test secret. The pipeline detected the secret and failed. After the
test secret was removed, the pipeline completed successfully.

## Secrets Management

Sensitive credentials are not stored directly in application source
code.

The JWT RSA private key is supplied through the `JWT_PRIVATE_KEY`
environment variable.

For local development, the secret is stored in the local `.env` file,
which is excluded from Git using `.gitignore`.

The `.env.example` file documents the required environment variable
without containing the actual private key.

For GitHub Actions, `JWT_PRIVATE_KEY` is stored as an encrypted GitHub
Actions repository secret and supplied to the application at runtime.

**Never commit the `.env` file or a real private key to the repository.**

## Local Setup

### Requirements

Install:

- Git
- Docker Desktop

### 1. Clone the repository

```bash
git clone https://github.com/kushaniC/DevSecOps-Pipeline.git
cd DevSecOps-Pipeline