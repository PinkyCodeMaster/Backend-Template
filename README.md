# 🏔️ BabySteps Backend

[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/2aw1b.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

Production-ready backend API server for the BabySteps financial management platform, built to help families break free from debt using the debt snowball method.

## What is BabySteps?

BabySteps Backend is a modern REST API server built with [Hono](https://hono.dev/) that powers both web and mobile applications for debt management and financial planning. The platform currently provides core infrastructure and monitoring capabilities, with financial service APIs under active development.

**Technology Stack:**
- **Runtime:** Node.js
- **Framework:** Hono (lightweight, fast web framework)
- **Logging:** Pino (structured JSON logging)
- **Monitoring:** Better Stack uptime monitoring
- **Validation:** Zod (type-safe environment configuration)

## Features

### ✅ Core Infrastructure (Available Now)

- **Production-Ready Server** - Hono-based HTTP server with optimized routing
- **Type-Safe Configuration** - Zod-validated environment variables with automatic type inference
- **Smart Network Detection** - Dynamic BASE_URL detection (LAN IP for mobile, localhost for web)
- **Structured Logging** - Pino logger with request tracking and correlation IDs
- **HTTP Request Logging** - Automatic logging of all requests with method, URL, status, and response time
- **Global Error Handling** - Graceful error recovery with sanitized responses in production
- **Health Monitoring** - `/health` endpoint for uptime checks and deployment verification
- **Uptime Monitoring** - Better Stack integration with alerting

### ⏳ Coming Soon

- OpenAPI documentation with Scalar UI
- CORS and security headers
- Database integration (Neon PostgreSQL + Drizzle ORM)
- Authentication and organization management
- Debt management APIs
- Income tracking APIs
- Baby Steps progress tracking

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- bun or pbun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PinkyCodeMaster/babysteps-server.git
   cd babysteps-server
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=9000
   LOG_LEVEL=debug
   
   # Optional: Better Stack monitoring (required in production)
   BETTERSTACK_SOURCE_TOKEN=your_token_here
   BETTERSTACK_UPTIME_URL=https://uptime.betterstack.com/api/v2/heartbeat/your_id
   ```

   See `.env.example` for a complete template.

4. **Start the development server**
   ```bash
   bun run dev
   ```

   You should see output similar to:
   ```
   🚀 Server starting...
   Environment: development
   Port: 9000
   Base URL: http://192.168.1.100:9000
   
   ✅ Server running at http://192.168.1.100:9000
   ```

### Usage

#### Health Check Endpoint

The `/health` endpoint is used by monitoring services, load balancers, and deployment systems to verify server status.

**Request:**
```bash
curl http://localhost:9000/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "babysteps-api",
  "environment": "development",
  "timestamp": "2025-12-08T14:12:45.123Z"
}
```

#### Development vs Production

The server automatically detects your environment and adjusts behavior:

- **Development**: Pretty-printed logs, detailed error messages, LAN IP detection for Expo
- **Production**: JSON logs, sanitized errors, localhost binding

Set `NODE_ENV=production` in your environment to enable production mode.

## Project Structure

```
src/
├── app/
│   ├── app.ts              # Hono app configuration, middleware, routing
│   └── server.ts           # Server initialization and startup
│
├── config/
│   └── env.ts              # Environment validation and BASE_URL detection
│
├── lib/
│   └── logger.ts           # Pino logger configuration
│
├── middleware/
│   ├── request-logger.ts   # HTTP request/response logging
│   └── error-handler.ts    # Global error handling and sanitization
│
├── routes/
│   └── health.ts           # Health check endpoint
│
└── index.ts                # Main entry point
```

## Monitoring & Observability

### Logging

All logs are structured JSON in production for easy parsing and analysis. Development mode uses pretty-printed logs for readability.

**Log Levels:**
- `fatal` - Application crashes
- `error` - Handled errors that need attention
- `warn` - Warning conditions
- `info` - General informational messages (default)
- `debug` - Detailed debugging information
- `trace` - Very detailed tracing

Configure via `LOG_LEVEL` environment variable.

**Request Logs Include:**
- HTTP method and URL
- Status code
- Response time in milliseconds
- Request ID for correlation
- User agent and remote address

### Uptime Monitoring

Better Stack continuously monitors the `/health` endpoint and sends alerts when the service becomes unavailable. The current status is displayed at the top of this README.

## Development

### Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun start` - Run production server
- `bun run lint` - Run ESLint (if configured)
- `bun test` - Run tests (if configured)

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`) |
| `PORT` | No | `9000` | Port number for the server |
| `LOG_LEVEL` | No | `info` | Minimum log level to output |
| `BETTERSTACK_SOURCE_TOKEN` | Prod only | - | Better Stack logging token |
| `BETTERSTACK_UPTIME_URL` | Prod only | - | Better Stack heartbeat URL |

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Configure `BETTERSTACK_SOURCE_TOKEN` and `BETTERSTACK_UPTIME_URL`
3. Set appropriate `LOG_LEVEL` (typically `info` or `warn`)
4. Ensure the server can bind to your desired `PORT`
5. Configure process manager (PM2, systemd, etc.) for automatic restarts

The server implements these production-ready practices:
- No stack traces leaked to clients
- Structured JSON logging for log aggregation
- Graceful error recovery
- Health check endpoint for load balancers
- Environment-based configuration

## Architecture Principles

This backend is built with these core principles:

- **No Silent Crashes** - All errors are caught, logged, and handled gracefully
- **No Leaked Stack Traces** - Production errors are sanitized for security
- **Centralized Logging** - All logs flow through Pino for consistency
- **Monitored Uptime** - Continuous health checks and alerting
- **Environment Separation** - Clear dev/prod behavior differences
- **Built to Scale** - Foundation ready for a real financial product

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

Quick start for contributors:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with clear commit messages
4. Ensure all tests pass
5. Push to your fork and submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/PinkyCodeMaster/babysteps-server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/PinkyCodeMaster/babysteps-server/discussions)
- **Email**: Contact the maintainer directly

## Maintainer

**Scott Jones** ([@PinkyCodeMaster](https://github.com/PinkyCodeMaster))

This project is maintained with ❤️ to help families achieve financial freedom.

## Roadmap

### Platform Infrastructure
- [ ] OpenAPI specification and Scalar documentation UI
- [ ] CORS and security headers
- [ ] Graceful shutdown handling
- [ ] Database connection pooling (Neon + Drizzle)
- [ ] Rate limiting middleware

### Authentication & Authorization
- [ ] User authentication system
- [ ] Organization/team management
- [ ] Role-based access control

### Financial Services
- [ ] Debt management APIs
- [ ] Income tracking APIs
- [ ] Baby Steps progress tracking
- [ ] Financial goal setting
- [ ] Debt snowball calculator

## License

Private project. All rights reserved.

---

Built with ❤️ to help families achieve financial freedom.