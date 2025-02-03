# Resume Analyzer Server

The backend server component of the Resume Analyzer application, built with NestJS. This server provides API endpoints for resume analysis, cover letter generation, and user authentication.

## 🌟 Features

- **AI-Powered Analysis**: Process and analyze resumes using OpenAI integration
- **Cover Letter Generation**: Generate tailored cover letters based on resume content and job descriptions
- **Authentication System**: Secure JWT-based authentication system
- **File Processing**: Handle resume file uploads and processing
- **RESTful API**: Well-structured API endpoints following REST principles
- **Database Integration**: TypeORM integration with PostgreSQL for data persistence

## 🏗️ Project Structure

The server is built using NestJS with a modular architecture:

```
src/
├── analyze/          # Resume analysis module
├── auth/            # Authentication module
├── cover-letter/    # Cover letter generation module
├── openai/          # OpenAI service integration
└── libs/
    └── shared/      # Shared resources (entities, DTOs, etc.)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm or bun package manager
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd ResumeAnalyzeServer
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration values.

### Development

```bash
# Run in development mode
pnpm start:dev

# Run in production mode
pnpm start:prod

# Run tests
pnpm test
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: JWT token expiration time
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: OpenAI model to use (default: gpt-4)
- `CORS_ORIGIN`: Allowed CORS origin for frontend
- `FILE_UPLOAD_SIZE`: Maximum file upload size
- `FILE_UPLOAD_PATH`: Path for storing uploaded files

## 📚 API Documentation

When the server is running, access the Swagger API documentation at:

```
http://localhost:3000/api/docs
```

Key API endpoints:

- `POST /auth/register`: User registration
- `POST /auth/login`: User authentication
- `POST /analyze/resume`: Resume analysis
- `POST /cover-letter/generate`: Cover letter generation
- `GET /user/profile`: User profile information

## 🧪 Testing

```bash
# Unit tests
pnpm test

# e2e tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## 🛠️ Development

### Database Migrations

```bash
# Generate a migration
pnpm migration:generate

# Run migrations
pnpm migration:run

# Revert last migration
pnpm migration:revert
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository.
