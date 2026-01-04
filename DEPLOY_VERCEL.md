# Hướng dẫn Deploy SPSS Frontend lên Vercel

## 📋 Yêu cầu trước khi deploy

- [ ] Tài khoản Vercel (đăng ký tại [vercel.com](https://vercel.com))
- [ ] Repository đã được push lên GitHub/GitLab/Bitbucket
- [ ] Backend API đang hoạt động

## 🚀 Các bước Deploy

### Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

#### Bước 1: Kết nối Repository

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Chọn **"Import Git Repository"**
4. Authorize Vercel truy cập GitHub/GitLab/Bitbucket của bạn
5. Tìm và chọn repository **SPSS-FE**

#### Bước 2: Cấu hình Project

1. **Framework Preset**: Vercel sẽ tự động detect là **Next.js**
2. **Root Directory**: Để trống (hoặc chọn `SPSS-FE` nếu là monorepo)
3. **Build Command**: `npm run build` (mặc định)
4. **Output Directory**: `.next` (mặc định)
5. **Install Command**: `npm install` (mặc định)

#### Bước 3: Cấu hình Environment Variables

Trong phần **"Environment Variables"**, thêm các biến sau:

| Name | Value | Mô tả |
|------|-------|-------|
| `NEXT_PUBLIC_BASE_URL` | `https://your-domain.vercel.app` | URL frontend (để trống nếu chưa biết, sẽ cập nhật sau) |
| `NEXT_PUBLIC_API_URL` | `https://spssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net/api` | URL Backend API |

> ⚠️ **Lưu ý**: Sau khi deploy lần đầu, bạn sẽ có được domain Vercel. Quay lại Settings → Environment Variables để cập nhật `NEXT_PUBLIC_BASE_URL` với domain thực.

#### Bước 4: Deploy

1. Click **"Deploy"**
2. Đợi quá trình build hoàn tất (khoảng 1-3 phút)
3. Sau khi deploy thành công, bạn sẽ nhận được URL dạng: `https://spss-fe-xxx.vercel.app`

---

### Cách 2: Deploy bằng Vercel CLI

#### Bước 1: Cài đặt Vercel CLI

```bash
npm install -g vercel
```

#### Bước 2: Đăng nhập

```bash
vercel login
```

#### Bước 3: Deploy

```bash
cd SPSS-FE
vercel
```

Làm theo hướng dẫn trên terminal:
- **Set up and deploy?** → Yes
- **Which scope?** → Chọn account của bạn
- **Link to existing project?** → No (lần đầu)
- **Project name?** → `spss-fe` (hoặc tên khác)
- **Directory?** → `./`
- **Override settings?** → No

#### Bước 4: Deploy Production

```bash
vercel --prod
```

---

## ⚙️ Cấu hình sau Deploy

### 1. Custom Domain (Tùy chọn)

1. Vào **Project Settings** → **Domains**
2. Thêm domain của bạn (ví dụ: `spss.yourdomain.com`)
3. Cập nhật DNS records theo hướng dẫn của Vercel

### 2. Cập nhật Environment Variables

1. Vào **Project Settings** → **Environment Variables**
2. Cập nhật `NEXT_PUBLIC_BASE_URL` với domain thực
3. Click **"Redeploy"** để áp dụng thay đổi

### 3. Cấu hình CORS trên Backend

Đảm bảo Backend API cho phép CORS từ domain Vercel của bạn. Cập nhật trong file `appsettings.json` của Backend:

```json
{
  "AllowedOrigins": [
    "https://spss-fe-xxx.vercel.app",
    "https://your-custom-domain.com"
  ]
}
```

---

## 🔧 Troubleshooting

### Lỗi Build

1. **Module not found**: Chạy `npm install` trước khi deploy
2. **Type errors**: Đã được bỏ qua trong `next.config.mjs` với `typescript.ignoreBuildErrors: true`

### Lỗi Runtime

1. **API không kết nối được**: 
   - Kiểm tra `NEXT_PUBLIC_API_URL` đã đúng chưa
   - Kiểm tra CORS trên Backend

2. **Trang trắng**:
   - Kiểm tra Console trên browser
   - Xem Vercel Function Logs trong dashboard

### Kiểm tra Logs

1. Vào **Project Dashboard** → **Deployments**
2. Click vào deployment cần xem
3. Chọn tab **"Functions"** hoặc **"Build Logs"**

---

## 📊 Monitoring

### Vercel Analytics (Miễn phí cho Hobby plan)

1. Vào **Project Settings** → **Analytics**
2. Enable **Web Analytics**

### Vercel Speed Insights

1. Vào **Project Settings** → **Speed Insights**
2. Enable để theo dõi Core Web Vitals

---

## 🔄 Auto Deploy

Mặc định, Vercel sẽ tự động deploy khi:
- Push code lên branch `main`/`master`
- Tạo Pull Request (Preview deployment)

Để thay đổi:
1. Vào **Project Settings** → **Git**
2. Cấu hình **Production Branch** và **Automatic Deployments**

---

## 📝 Checklist sau Deploy

- [ ] Website load được và hiển thị đúng
- [ ] API calls hoạt động (đăng nhập, load sản phẩm, etc.)
- [ ] Images hiển thị đúng
- [ ] Responsive trên mobile
- [ ] Cập nhật `NEXT_PUBLIC_BASE_URL` với domain thực
- [ ] Cấu hình CORS trên Backend (nếu cần)
- [ ] Test các chức năng chính (login, checkout, etc.)

---

## 📞 Hỗ trợ

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Status](https://www.vercel-status.com/)
