export const CV_EVALUATION_PROMPT = `
Anda adalah seorang HR expert yang bertugas mengevaluasi CV kandidat berdasarkan deskripsi pekerjaan.

DESKRIPSI PEKERJAAN:
{jobDescription}

CV KANDIDAT:
{cvText}

Evaluasi CV ini berdasarkan kriteria berikut:
1. Kesesuaian pengalaman kerja dengan posisi
2. Relevansi skill teknis
3. Tingkat pendidikan
4. Pengalaman proyek yang relevan
5. Sertifikasi dan achievement

Berikan output dalam format JSON berikut:
{
  "match_rate": 0.85,
  "feedback": "Penjelasan detail tentang kesesuaian kandidat",
  "strengths": ["Kekuatan 1", "Kekuatan 2"],
  "weaknesses": ["Kelemahan 1", "Kelemahan 2"]
}

Pastikan match_rate adalah angka antara 0-1.
`;

export const PROJECT_EVALUATION_PROMPT = `
Anda adalah seorang technical reviewer yang mengevaluasi laporan proyek kandidat.

BRIEF STUDI KASUS:
{projectBrief}

LAPORAN PROYEK:
{projectText}

Evaluasi laporan proyek berdasarkan kriteria:
1. Kualitas teknis implementasi
2. Pemahaman terhadap requirements
3. Kualitas dokumentasi
4. Problem solving approach
5. Code quality dan best practices

Berikan output dalam format JSON berikut:
{
  "score": 4.2,
  "feedback": "Penjelasan detail tentang kualitas proyek",
  "technical_quality": 4.0,
  "implementation_quality": 4.5,
  "documentation_quality": 4.0
}

Pastikan score adalah angka antara 1-5.
`;

export const FINAL_ANALYSIS_PROMPT = `
Berdasarkan hasil evaluasi CV dan proyek, berikan analisis akhir untuk kandidat.

HASIL EVALUASI CV:
{cvEvaluation}

HASIL EVALUASI PROYEK:
{projectEvaluation}

POSISI YANG DILAMAR: {jobTitle}

Berikan analisis akhir dalam format JSON berikut:
{
  "overall_summary": "Ringkasan keseluruhan tentang kandidat",
  "recommendation": "Rekomendasi apakah kandidat layak untuk tahap selanjutnya",
  "fit_score": 0.78
}

Pastikan fit_score adalah angka antara 0-1 yang merepresentasikan kesesuaian keseluruhan.
`;

export const JOB_DESCRIPTIONS = {
  "Backend Engineer": `
Posisi: Backend Engineer
Tanggung Jawab:
- Mengembangkan dan memelihara API backend menggunakan Node.js/Python
- Mendesain dan mengimplementasikan database schema
- Mengintegrasikan dengan layanan third-party
- Memastikan keamanan dan performa aplikasi
- Mengimplementasikan CI/CD pipeline

Kualifikasi:
- Minimal 2 tahun pengalaman backend development
- Menguasai Node.js, Express.js, atau framework serupa
- Pengalaman dengan database (PostgreSQL, MongoDB)
- Familiar dengan cloud services (AWS, GCP, Azure)
- Memahami konsep microservices dan API design
- Pengalaman dengan Docker dan containerization
`,
  "Frontend Engineer": `
Posisi: Frontend Engineer
Tanggung Jawab:
- Mengembangkan user interface yang responsif dan user-friendly
- Mengimplementasikan design system dan component library
- Mengoptimalkan performa aplikasi web
- Berkolaborasi dengan designer dan backend engineer
- Memastikan cross-browser compatibility

Kualifikasi:
- Minimal 2 tahun pengalaman frontend development
- Menguasai React.js, Vue.js, atau Angular
- Pengalaman dengan TypeScript dan modern JavaScript
- Familiar dengan CSS preprocessor dan build tools
- Memahami konsep responsive design dan accessibility
- Pengalaman dengan testing framework
`,
  "Full Stack Engineer": `
Posisi: Full Stack Engineer
Tanggung Jawab:
- Mengembangkan aplikasi end-to-end dari frontend hingga backend
- Mendesain arsitektur aplikasi yang scalable
- Mengimplementasikan fitur baru dan maintenance aplikasi existing
- Berkolaborasi dengan tim product dan design
- Memastikan kualitas code dan best practices

Kualifikasi:
- Minimal 3 tahun pengalaman full stack development
- Menguasai frontend framework (React, Vue, Angular)
- Menguasai backend technology (Node.js, Python, Java)
- Pengalaman dengan database design dan optimization
- Familiar dengan DevOps practices dan cloud deployment
- Strong problem-solving dan communication skills
`
};

export const PROJECT_BRIEFS = {
  "Backend Engineer": `
BRIEF STUDI KASUS - Backend Engineer

Tugas: Membangun sistem manajemen inventory untuk e-commerce

Requirements:
1. REST API untuk CRUD operations (products, categories, suppliers)
2. Authentication dan authorization system
3. Real-time inventory tracking
4. Integration dengan payment gateway
5. Automated reporting system
6. Rate limiting dan caching mechanism

Technical Requirements:
- Gunakan Node.js dengan TypeScript
- Database PostgreSQL dengan proper indexing
- Implement proper error handling
- Unit testing coverage minimal 80%
- API documentation dengan Swagger
- Docker containerization
- Monitoring dan logging system

Deliverables:
- Source code dengan clean architecture
- Database schema design
- API documentation
- Unit test results
- Deployment guide
- Performance benchmarking report
`,
  "Frontend Engineer": `
BRIEF STUDI KASUS - Frontend Engineer

Tugas: Membangun dashboard analytics untuk business intelligence

Requirements:
1. Interactive charts dan data visualization
2. Real-time data updates
3. Responsive design untuk mobile dan desktop
4. Advanced filtering dan search functionality
5. Export data ke berbagai format
6. User preference dan customization

Technical Requirements:
- Gunakan React.js dengan TypeScript
- State management dengan Redux/Zustand
- Chart library (D3.js, Chart.js, atau Recharts)
- Implement proper error boundaries
- Component testing dengan Jest/RTL
- Accessibility compliance (WCAG 2.1)
- Performance optimization (lazy loading, memoization)

Deliverables:
- Source code dengan component library
- Design system documentation
- Test coverage report
- Performance audit results
- Accessibility audit report
- Deployment guide
`,
  "Full Stack Engineer": `
BRIEF STUDI KASUS - Full Stack Engineer

Tugas: Membangun platform learning management system (LMS)

Requirements:
1. User management (students, instructors, admins)
2. Course creation dan management
3. Video streaming dan progress tracking
4. Quiz dan assignment system
5. Discussion forum
6. Payment integration
7. Certificate generation
8. Mobile responsive design

Technical Requirements:
- Frontend: React.js dengan TypeScript
- Backend: Node.js dengan Express.js
- Database: PostgreSQL dengan Redis caching
- File storage: AWS S3 atau equivalent
- Real-time features dengan WebSocket
- Email notification system
- Comprehensive testing (unit, integration, e2e)
- CI/CD pipeline setup

Deliverables:
- Full source code (frontend + backend)
- Database design dan migrations
- API documentation
- Test coverage reports
- Deployment architecture diagram
- User manual dan technical documentation
- Performance dan security audit
`
};