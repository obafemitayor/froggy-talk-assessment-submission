# Froggytalk

Froggytalk is a full-stack billing demo built for a take-home assessment.
It combines a Laravel backend, Redis-backed queue processing, and Laravel Reverb to deliver real-time payment and balance updates to a React SPA.

## Project Map

```text
froggytalk/
├── backend/
│   ├── app/
│   │   ├── Enums/
│   │   ├── Events/
│   │   │   └── PaymentStatus.php
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       ├── AuthController.php
│   │   │   │       ├── BalanceController.php
│   │   │   │       └── PaymentController.php
│   │   │   └── Requests/
│   │   │       └── InitiatePaymentRequest.php
│   │   ├── Jobs/
│   │   │   └── ProcessPaymentJob.php
│   │   ├── Models/
│   │   │   ├── Payment.php
│   │   │   └── User.php
│   │   ├── Providers/
│   │   │   └── BroadcastServiceProvider.php
│   │   └── Services/
│   │       ├── CurrencyService.php
│   │       └── PaymentService.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── docker/
│   ├── docker-compose.yml
│   ├── phpunit.docker.xml
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useBalance.ts
│   │   │   ├── usePaymentChannel.ts
│   │   │   └── usePayments.ts
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   │   ├── components/
│   │   │   │   │   ├── Balance.tsx
│   │   │   │   │   ├── HomeHeader.tsx
│   │   │   │   │   └── Payment.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── messages.ts
│   │   │   └── Login/
│   │   │       ├── index.tsx
│   │   │       └── messages.ts
│   │   ├── services/
│   │   │   ├── apiClient.ts
│   │   │   ├── authService.ts
│   │   │   ├── balanceService.ts
│   │   │   ├── paymentService.ts
│   │   │   └── realtimeService.ts
│   │   ├── styles.css
│   │   └── main.tsx
│   └── ...
├── challenge.md
└── README.md
```

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ and npm if you want to run the frontend outside Docker
- A `JWT_SECRET` value available to the backend Compose environment

## How To Launch The App

### Backend

From the `backend/` directory:

```bash
docker compose up -d --build
```

This starts the Laravel API, MySQL, Redis, the queue worker, and Reverb.

After the containers are running, apply the database migrations:

```bash
docker compose exec app php artisan migrate --force
```

Then seed the default test user:

```bash
docker compose exec app php artisan db:seed --force
```

### Frontend

From the `frontend/` directory:

```bash
npm install
npm run dev
```

The app runs with Vite on the default development port.

### Default Test Credentials

- Email: `test@example.com`
- Password: `password`
- Starting balance: `100.00 USD`

## How To Run Tests

From the `backend/` directory:

```bash
docker compose run --rm tests
```

This uses the Docker test service and `phpunit.docker.xml` so tests run against the dedicated test database.

## Architecture Overview

- The React SPA lives in `frontend/` and talks to the Laravel API through REST endpoints and WebSockets.
- The Laravel API lives in `backend/` and owns authentication, payment creation, balance retrieval, and event broadcasting.
- Payment requests are saved by the backend, dispatched through a Redis-backed queue, and processed asynchronously by a worker.
- When payment state changes, the backend broadcasts updates through Reverb so the frontend can update balance and payment state in real time.

## Key API Endpoints

- `POST /api/auth/login` authenticates a user and returns a JWT token.
- `GET /api/balance` returns the authenticated customer balance.
- `POST /api/payments` creates a new payment request and queues processing.

## What I Would Improve With More Time

- Add extensive frontend tests using `react-testing-library`
- Improve the UI design
