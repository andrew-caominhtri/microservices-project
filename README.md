# Cloud Project - TTD Shop

Đây là dự án monorepo cho website bán hàng công nghệ, gồm:
- `backend`: API server viết bằng Express, kết nối PostgreSQL.
- `frontend`: giao diện người dùng viết bằng Next.js (App Router).

README này mô tả đầy đủ cách cài đặt, cấu hình, chạy local, API hiện có, cấu trúc dữ liệu và các lưu ý bảo mật để cả nhóm có thể dùng chung.

## 1) Công nghệ sử dụng

### Backend
- Node.js + Express
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`)
- Mã hóa mật khẩu (`bcrypt`)
- Upload ảnh (`multer`)
- CORS (`cors`)

### Frontend
- Next.js 16
- React 19
- TypeScript
- Font Awesome (CDN + package)

## 2) Cấu trúc thư mục

```text
cloud-project/
|- backend/      # API + DB access + upload
|- frontend/     # Next.js client
|- .gitignore
`- README.md
```

## 3) Yêu cầu môi trường

- Node.js 18+ (khuyến nghị Node.js 20 LTS)
- npm 9+
- PostgreSQL (local hoặc cloud như Render, Neon, Supabase...)
- Hệ điều hành: Windows/macOS/Linux đều chạy được

## 4) Cài đặt dự án

### Bước 1: Cài dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Bước 2: Tạo file môi trường

#### Backend

Tạo `backend/.env` từ `backend/.env.example`

Nội dung mẫu:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@host:5432/dbname
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=https://your-frontend-domain.com
```

Lệnh tạo nhanh:

```bash
cd backend
cp .env.example .env
```

Nếu bạn dùng PowerShell (Windows), có thể dùng:

```powershell
Copy-Item .env.example .env
```

#### Frontend

Tạo `frontend/.env.local` từ `frontend/.env.example`

Nội dung mẫu:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

Lệnh tạo nhanh:

```bash
cd frontend
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

## 5) Chạy local

Mở 2 terminal riêng.

### Terminal 1 - chạy backend

```bash
cd backend
npm start
```

Backend mặc định chạy ở `http://localhost:5000`.

### Terminal 2 - chạy frontend

```bash
cd frontend
npm run dev
```

Frontend mặc định chạy ở `http://localhost:3000`.

## 6) Biến môi trường chi tiết

### Backend (`backend/.env`)

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `PORT` | Không | Port chạy Express, mặc định `5000` |
| `DATABASE_URL` | Có | Chuỗi kết nối PostgreSQL |
| `JWT_SECRET` | Có | Secret ký/verify JWT |
| `CORS_ORIGIN` | Nên có | Danh sách origin cho phép, phân tách bằng dấu phẩy |

Ví dụ:

```env
CORS_ORIGIN=http://localhost:3000,https://your-app.vercel.app
```

### Frontend (`frontend/.env.local`)

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Có | Base URL của backend để frontend gọi API |

Ví dụ local:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 7) API backend hiện có

Base backend: `http://localhost:5000`

### Health check
- `GET /` -> `API Running...`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin-register`
- `POST /api/auth/admin-login`

### Product
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (multipart/form-data, field ảnh: `image`)
- `PUT /api/products/:id` (multipart/form-data, field ảnh: `image`)
- `DELETE /api/products/:id`

### Order
- `POST /api/orders` (cần token)
- `GET /api/orders/:userId` (cần token)

### Static file upload
- `GET /uploads/<filename>`

## 8) Cấu trúc dữ liệu tối thiểu (tham khảo)

Dựa trên các câu lệnh SQL hiện có trong code, DB cần các bảng sau:

- `users(id, name, email, password)`
- `admin(id, name, email, password)`
- `products(id, name, price, image, description, category, brand)`
- `orders(id, user_id, total_price)`
- `order_items(id, order_id, product_id, quantity)`

Bạn có thể tạo migration/SQL riêng theo tiêu chuẩn nhóm để đảm bảo đúng kiểu dữ liệu và ràng buộc khóa ngoại.

## 9) Scripts

### Backend (`backend/package.json`)
- `npm start`: chạy API (`node server.js`)

### Frontend (`frontend/package.json`)
- `npm run dev`: chạy môi trường phát triển
- `npm run build`: build production
- `npm start`: chạy bản production
- `npm run lint`: kiểm tra lint

## 10) Bảo mật và quản lý secret

- Không commit file chứa giá trị thật:
  - `backend/.env`
  - `frontend/.env.local`
- Được commit file mẫu:
  - `backend/.env.example`
  - `frontend/.env.example`
- Nếu lộ secret, cần rotate ngay:
  - mật khẩu DB
  - `JWT_SECRET`
  - API key/token khác (nếu có)

## 11) Lưu ý quan trọng về đường dẫn API frontend

Trong code hiện tại, đa số màn hình gọi API theo dạng:
- `${apiUrl}/api/...`

Tuy nhiên trang đăng ký/đăng nhập user đang gọi:
- `${apiUrl}/auth/register`
- `${apiUrl}/auth/login`

Trong khi backend mount auth tại `/api/auth`.

Nếu gặp lỗi 404 ở đăng nhập/đăng ký user, bạn có 2 cách:
- Cách 1 (khuyến nghị): sửa frontend để gọi thống nhất `/api/auth/...`
- Cách 2: cấu hình reverse proxy phù hợp để map `/auth/*` về backend

## 12) Troubleshooting nhanh

### Lỗi CORS
- Kiểm tra `CORS_ORIGIN` trong `backend/.env`.
- Đảm bảo domain frontend được khai báo đúng.
- Backend hiện cho phép thêm `localhost:3000`, `127.0.0.1:3000`, `localhost:3001` và `*.vercel.app` (HTTPS).

### Lỗi không kết nối DB
- Kiểm tra `DATABASE_URL`.
- Kiểm tra database có cho phép SSL hay không.
- Code backend đang bật SSL với `rejectUnauthorized: false`.

### Lỗi ảnh không hiển thị trên frontend
- Kiểm tra `NEXT_PUBLIC_API_URL` đúng host backend.
- Kiểm tra backend có trả ảnh tại `/uploads/...`.
- Kiểm tra file ảnh đã upload thành công.

### Lỗi đăng nhập admin redirect liên tục
- Kiểm tra `adminToken` có tồn tại trong `localStorage`.
- Đăng nhập lại tại `/admin-login`.