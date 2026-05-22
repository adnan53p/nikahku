# 💍 Invitely — Platform Undangan Digital Premium

> Platform SaaS undangan pernikahan digital modern, production-ready, dan scalable untuk ribuan client.

---

## 🗂 Struktur Project

```
invitely/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fonts, toaster)
│   │   ├── page.tsx                  # Landing page
│   │   ├── not-found.tsx             # 404 page
│   │   ├── auth/
│   │   │   ├── login/page.tsx        # Halaman login
│   │   │   ├── register/page.tsx     # Halaman register
│   │   │   └── forgot-password/      # Reset password
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Dashboard layout + sidebar
│   │   │   ├── page.tsx              # Dashboard utama
│   │   │   ├── events/
│   │   │   │   ├── page.tsx          # Daftar undangan
│   │   │   │   └── [id]/page.tsx     # Detail/edit undangan
│   │   │   ├── guests/page.tsx       # Overview semua tamu
│   │   │   ├── themes/page.tsx       # Pilih tema
│   │   │   └── settings/page.tsx     # Pengaturan akun
│   │   ├── u/
│   │   │   ├── [slug]/page.tsx       # Undangan tanpa tamu
│   │   │   └── [slug]/[guest]/       # Undangan per tamu
│   │   └── admin/
│   │       ├── layout.tsx            # Admin layout
│   │       ├── page.tsx              # Admin dashboard
│   │       ├── users/page.tsx        # Kelola user
│   │       ├── events/page.tsx       # Kelola semua event
│   │       └── themes/page.tsx       # Kelola tema
│   ├── components/
│   │   ├── landing/                  # Komponen landing page
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TrustedSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── TemplatePreview.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── FaqSection.tsx
│   │   │   ├── CtaSection.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/
│   │   │   ├── EventModal.tsx        # Modal buat/edit event
│   │   │   └── tabs/                 # Tab konten event detail
│   │   │       ├── EventInfoTab.tsx
│   │   │       ├── GalleryTab.tsx
│   │   │       ├── MusicTab.tsx
│   │   │       ├── GiftTab.tsx
│   │   │       ├── GuestTab.tsx
│   │   │       └── RsvpTab.tsx
│   │   └── invitation/               # Komponen halaman undangan
│   │       ├── InvitationPage.tsx
│   │       ├── CoverSection.tsx
│   │       ├── CoupleSection.tsx
│   │       ├── CountdownSection.tsx
│   │       ├── RsvpSection.tsx
│   │       └── sections.tsx          # LoveStory, Gallery, Maps, Gift, Wishes
│   ├── hooks/
│   │   ├── useAuth.ts                # Auth state hook
│   │   └── useCountdown.ts           # Countdown timer + utilities
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   └── server.ts             # Server client + admin client
│   │   ├── validations/index.ts      # Zod schemas
│   │   └── utils/index.ts            # Helper functions
│   ├── services/
│   │   ├── auth.service.ts           # Auth operations
│   │   └── event.service.ts          # Event, guest, RSVP, storage
│   ├── types/index.ts                # TypeScript types & Database types
│   ├── styles/globals.css            # Global CSS + design tokens
│   └── middleware.ts                 # Auth middleware
├── supabase-schema.sql               # 📌 Schema database lengkap
├── .env.local.example                # Template environment variables
├── tailwind.config.ts                # Tailwind + custom tokens
├── next.config.ts                    # Next.js config
└── tsconfig.json
```

---

## 🚀 Setup & Instalasi

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/yourusername/invitely.git
cd invitely
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** di dashboard Supabase
3. Copy seluruh isi `supabase-schema.sql` → Paste → **Run**
4. Tunggu sampai semua tabel, RLS, trigger, dan seed data terbuat

### 3. Setup Storage Buckets

Setelah menjalankan SQL schema, bucket sudah otomatis dibuat. Verifikasi di:
**Supabase Dashboard → Storage**

Pastikan ada 3 bucket:
- `events` → untuk cover image
- `galleries` → untuk foto galeri
- `music` → untuk file audio

Jika belum ada, buat manual:
1. Klik **New Bucket**
2. Centang **Public bucket**
3. Buat untuk: `events`, `galleries`, `music`

### 4. Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Invitely
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
```

Cara mendapatkan keys:
- **Supabase Dashboard → Settings → API**
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (**jaga kerahasiaan!**)

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploy ke Vercel

### Step 1: Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/invitely.git
git push -u origin main
```

### Step 2: Import ke Vercel

1. Buka [vercel.com](https://vercel.com) → **New Project**
2. Import repository dari GitHub
3. Framework: **Next.js** (auto-detected)
4. Tambahkan **Environment Variables** (sama seperti `.env.local`)
5. Klik **Deploy**

### Step 3: Update Environment URL

Setelah deploy selesai, update:
```env
NEXT_PUBLIC_APP_URL=https://namadomain.vercel.app
```

Redeploy untuk apply perubahan.

---

## 🌐 Koneksi Custom Domain

### Di Vercel:
1. **Project Settings → Domains**
2. Tambahkan domain (misal: `invitely.id`)
3. Ikuti petunjuk DNS yang diberikan

### Di Domain Provider (Namecheap, Cloudflare, dll):
```
Type: A Record
Name: @
Value: 76.76.21.21  (Vercel IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Di Supabase:
Tambahkan domain ke **Authentication → URL Configuration**:
```
Site URL: https://invitely.id
Redirect URLs: https://invitely.id/**
```

---

## 📸 Upload & Kelola Gambar

### Cover Image Undangan
- Format: JPG, PNG, WEBP
- Resolusi ideal: **1200 × 800px** (3:2 ratio)
- Ukuran maks: **5MB**
- Upload melalui: Dashboard → Undangan → Edit → Tab Info → Foto Cover

### Galeri Foto
- Format: JPG, PNG, WEBP
- Ukuran maks: **5MB per foto**
- Maks: **50 foto** (plan Premium)
- Upload melalui: Dashboard → Undangan → Edit → Tab Galeri
- Bisa upload multiple sekaligus

### Musik Latar
- Format: **MP3**, AAC, OGG
- Ukuran maks: **10MB**
- Upload melalui: Dashboard → Undangan → Edit → Tab Musik

---

## 👥 Generate Guest Links

### Metode 1: Import Excel
1. Download template: Dashboard → Undangan → Edit → Tab Tamu → **Template**
2. Isi template dengan kolom: `nama`, `telepon`
3. Upload file Excel di tab Tamu
4. Sistem otomatis generate link unik per tamu

### Metode 2: Input Manual
1. Klik **Tambah Manual**
2. Ketik satu nama per baris
3. Klik **Tambahkan**

### Format Link Generated
```
https://invitely.id/u/adnan-siti/budi-santoso
https://invitely.id/u/adnan-siti/sari-dewi
```

### Kirim via WhatsApp
- Klik ikon WhatsApp di samping nama tamu
- Pesan undangan otomatis terisi dengan nama tamu
- Klik Send di WhatsApp

---

## 🗄 Database Tables

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data pengguna platform |
| `events` | Data undangan pernikahan |
| `guests` | Daftar tamu per undangan |
| `rsvp` | Konfirmasi kehadiran tamu |
| `galleries` | Foto galeri per undangan |
| `themes` | Template tema undangan |
| `gift_accounts` | Info rekening hadiah |
| `event_music` | File musik latar |

---

## 🔐 Keamanan

- ✅ **RLS (Row Level Security)** aktif di semua tabel
- ✅ **Middleware auth** proteksi route dashboard & admin
- ✅ **Zod validation** di semua form input
- ✅ **HTTPS** via Vercel (otomatis)
- ✅ **JWT Session** via Supabase Auth
- ✅ **Service Role Key** hanya di server-side

---

## 🎨 Cara Buat Tema Baru

1. Login sebagai **Admin**
2. Buka `/admin/themes`
3. Klik **Tambah Tema**
4. Pilih kombinasi warna dan font
5. Preview langsung tampil di form
6. Simpan → tema langsung tersedia untuk semua user

---

## 📊 Pricing Plans

| Plan | Harga | Tamu | Foto | Fitur |
|------|-------|------|------|-------|
| Free | Gratis | 50 | 5 | Dasar |
| Basic | Rp149.000 | 100 | 10 | + RSVP |
| Premium | Rp299.000 | 500 | 50 | + Musik, Excel, Amplop |
| Enterprise | Rp599.000 | ∞ | ∞ | Semua + Custom Domain |

---

## 🛠 Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Next.js | 15 | Framework + App Router |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Styling |
| Framer Motion | 11 | Animasi |
| Supabase | Latest | Auth + DB + Storage + Realtime |
| React Hook Form | 7 | Form management |
| Zod | 3 | Validation |
| SheetJS (xlsx) | 0.18 | Import Excel |
| Lucide React | Latest | Icons |
| React Hot Toast | 2 | Notifications |

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@/...'"
Pastikan `tsconfig.json` memiliki path alias `"@/*": ["./src/*"]`

### Error: "Supabase URL not defined"
Pastikan `.env.local` sudah diisi dan server di-restart

### Storage upload gagal
Cek bucket policy di Supabase → Storage → Policies

### Halaman undangan 404
Pastikan event sudah di-publish: Dashboard → Undangan → Klik "Publish"

### RLS error saat query
Jalankan ulang SQL policy di Supabase SQL Editor

---

## 📞 Support

- WhatsApp: +62 812-3456-7890
- Email: hello@invitely.id
- Dokumentasi: docs.invitely.id

---

*Dibuat dengan ❤️ untuk semua pasangan yang ingin momen spesial mereka selalu dikenang.*
