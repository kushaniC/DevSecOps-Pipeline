# Application, Architecture & Containerisation

## 1. Selected Application

The selected application for this project is OWASP Juice Shop.

OWASP Juice Shop is an intentionally vulnerable open-source web application. It is suitable for this assignment because it provides a realistic web application environment for demonstrating vulnerabilities, secure coding fixes, Docker containerisation, threat modelling and DevSecOps security automation.

The assignment requires the selected application to have at least two communicating components and to be containerisable with Docker. OWASP Juice Shop is listed in the assignment's approved application list.

## 2. Application Components

### Nginx Frontend

The Nginx frontend is the public-facing web/edge component. It receives browser requests and forwards appropriate requests to the Juice Shop application. It is exposed through port 80.

### Juice Shop Backend

The Juice Shop backend contains the main application logic and API functionality. It handles application requests, authentication, authorization, REST API operations and communication with application data/storage. It listens internally on port 3000.

## 3. Docker Containerisation

The project uses Docker to run the application components in isolated containers.

Docker Compose is used to start the application as a multi-container system.

The main services are:

- `nginx-frontend`
- `juice-shop`

The Nginx frontend is built from the `nginx` directory.

The Juice Shop application is built using the project's Dockerfile.

Docker Compose allows the complete application environment to be started as a single multi-container application.

## 4. Docker Networks

The project uses two Docker networks:

- `frontend-net`
- `backend-net`

The Nginx frontend is connected to both networks.

The Juice Shop backend is connected to the backend network.

The backend network is configured as an internal Docker network.

The intended communication path is:

Browser → Nginx Frontend → Juice Shop Backend → Application Data/Storage

The browser should communicate with the public Nginx layer rather than directly accessing the backend service.

## 5. Application Architecture

### Layer 1 – User / Client

The user accesses the application through a web browser. The browser sends HTTP requests to the public Nginx frontend.

### Layer 2 – Frontend / Reverse Proxy

Nginx acts as the edge component. It receives requests from the browser and forwards application requests to the Juice Shop backend.

### Layer 3 – Backend / Application

The Juice Shop backend processes requests and performs application operations. It handles application logic, authentication, authorization and API functionality, and communicates with the application's data/storage layer when required.

## 6. Trust Boundaries

### Public Trust Boundary

This exists between the user's browser and the Nginx frontend. Requests entering the system from the browser should be treated as untrusted input.

### Application Trust Boundary

This exists between Nginx and the Juice Shop backend. Nginx forwards requests into the internal application environment.

### Internal/Data Boundary

This exists between the Juice Shop backend and internal application data/storage. This area should not be directly exposed to an external user.

### CI/CD Trust Boundary

A separate security boundary exists between the source-code repository and GitHub Actions. The CI/CD environment builds the application and executes security checks.

## 7. CI/CD Architecture

The development and security workflow can be represented as:

Developer → GitHub Repository → GitHub Actions → Build/Test → SAST → Dependency Scan → Secrets Scan → Docker Build → Container Scan → Security Decision

The current pipeline includes the four security tools required by the assignment:

- Semgrep for SAST.
- npm audit for dependency/software composition scanning.
- Gitleaks for secrets scanning.
- Trivy for container image scanning.

The final project should provide evidence of the security gates executing successfully and at least one gate genuinely blocking a bad build.

## 8. Containerisation Benefits

Containerisation provides consistency between development environments, service isolation, reproducible deployment, and the ability to scan container images with security tools such as Trivy.


