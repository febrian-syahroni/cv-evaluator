# CV Evaluation Backend

Aplikasi backend untuk otomatisasi penyaringan awal lamaran kerja menggunakan AI. Sistem ini dapat mengevaluasi CV kandidat dan laporan proyek berdasarkan deskripsi pekerjaan dan memberikan laporan evaluasi terstruktur.

## 🚀 Fitur Utama

- **Upload File**: Menerima CV dan laporan proyek dalam format PDF
- **Evaluasi AI**: Menggunakan OpenAI GPT-4 untuk evaluasi otomatis
- **Proses Asinkron**: Menggunakan BullMQ untuk job queue
- **Database**: PostgreSQL dengan Prisma ORM
- **Vector Database**: ChromaDB untuk menyimpan embeddings dokumen
- **RESTful API**: Endpoint yang mudah digunakan

## 🛠️ Teknologi

- **Backend**: Node.js + TypeScript + Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Queue**: BullMQ + Redis
- **AI**: OpenAI API
- **File Processing**: Multer + pdf-parse
- **Vector DB**: ChromaDB

## 📋 Prerequisites

Pastikan Anda telah menginstall:

- Node.js (v18 atau lebih baru)
- PostgreSQL
- Redis
- npm atau yarn

## 🔧 Instalasi

1. **Clone repository**

```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/cv_evaluation_db"
OPENAI_API_KEY="your_openai_api_key_here"
REDIS_HOST="localhost"
REDIS_PORT=6379
PORT=3000
```

4. **Setup database**

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

5. **Build aplikasi**

```bash
npm run build
```

## 🚀 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📡 API Endpoints

### 1. Upload Files

**POST** `/upload`

Upload CV dan laporan proyek dalam format PDF.

**Request:**

```bash
curl -X POST http://localhost:3000/upload \
  -F "cv=@path/to/cv.pdf" \
  -F "projectReport=@path/to/project.pdf"
```

**Response:**

```json
{
  "cvId": "uuid-cv-id",
  "projectReportId": "uuid-project-id"
}
```

### 2. Start Evaluation

**POST** `/evaluate`

Memulai proses evaluasi AI secara asinkron.

**Request:**

```json
{
  "jobTitle": "Backend Engineer",
  "cvId": "uuid-cv-id",
  "projectReportId": "uuid-project-id"
}
```

**Response:**

```json
{
  "id": "job_123",
  "status": "queued"
}
```

### 3. Get Evaluation Result

**GET** `/evaluate/result/:id`

Mengambil hasil evaluasi berdasarkan job ID.

**Response (Processing):**

```json
{
  "id": "job_123",
  "status": "processing"
}
```

**Response (Completed):**

```json
{
  "id": "job_123",
  "status": "completed",
  "result": {
    "cv_match_rate": 0.82,
    "cv_feedback": "Kuat di backend dan cloud, namun pengalaman AI masih terbatas.",
    "project_score": 4.5,
    "project_feedback": "Prompt chaining terpenuhi, tetapi error handling belum optimal.",
    "overall_summary": "Cocok untuk peran backend, disarankan memperdalam RAG dan LLM workflow."
  }
}
```

### 4. Health Check

**GET** `/health`

Mengecek status kesehatan aplikasi.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

## 🏗️ Arsitektur Sistem

```mermaid
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   Express API   │───▶│   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│
▼
┌─────────────────┐    ┌─────────────────┐
│   BullMQ Queue  │───▶│      Redis      │
└─────────────────┘    └─────────────────┘
│
▼
┌─────────────────┐    ┌─────────────────┐
│  AI Evaluation  │───▶│   OpenAI API    │
│     Worker      │    └─────────────────┘
└─────────────────┘
```

## 🔄 Alur Evaluasi

1. **Upload**: Client mengupload CV dan laporan proyek
2. **Queue**: Sistem membuat job evaluasi dan memasukkannya ke queue
3. **Processing**: Worker mengambil job dan memproses:
   - Extract text dari PDF
   - Evaluasi CV dengan AI
   - Evaluasi proyek dengan AI
   - Generate analisis akhir
4. **Result**: Hasil evaluasi disimpan dan dapat diambil client

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 📊 Monitoring

Aplikasi menyediakan beberapa endpoint untuk monitoring:

- **Health Check**: `GET /health`
- **Queue Status**: Dapat dimonitor melalui BullMQ Dashboard
- **Database**: Dapat dimonitor melalui Prisma Studio (`npm run prisma:studio`)

## 🔒 Security

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **File Validation**: Hanya menerima file PDF
- **Size Limit**: Maksimal 10MB per file
- **Rate Limiting**: Implementasi rate limiting (opsional)

## 🚀 Deployment

### Docker Deployment

1. **Build Docker image**

```bash
docker build -t cv-evaluation-backend .
```

2. **Run with Docker Compose**

```bash
docker-compose up -d
```

### Manual Deployment

1. **Setup production environment**
2. **Install dependencies**: `npm ci --production`
3. **Build aplikasi**: `npm run build`
4. **Run migrations**: `npm run prisma:migrate`
5. **Start aplikasi**: `npm start`

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Check dokumentasi API
2. Review logs aplikasi
3. Check issue tracker
4. Contact support team

## 🔄 Changelog

### v1.0.0

- Initial release
- Basic CV and project evaluation
- File upload functionality
- Asynchronous processing with BullMQ
- OpenAI integration
- PostgreSQL database with Prisma
