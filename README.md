# MyRoom

Azərbaycan üzrə qısamüddətli istirahət elanları — hotel, hostel, A-frame, rayon evləri.

## Texnologiyalar

- **Next.js 15** (App Router)
- **Supabase** (PostgreSQL, Auth, Storage)
- **S3 SDK** (Supabase Storage / gələcəkdə Cloudflare R2)
- **browser-image-compression** (brauzerdə şəkil sıxma)

## Quraşdırma

### 1. Asılılıqlar

```bash
npm install
```

### 2. Supabase layihəsi

1. [supabase.com](https://supabase.com) — yeni layihə yaradın
2. SQL Editor-də `supabase/migrations/001_initial_schema.sql` faylını işlədin
3. Storage → yeni bucket: `property-images` (public)
4. Storage → S3 Access Keys yaradın
5. **Authentication → URL Configuration**:
  - Site URL: `http://localhost:3000`
  - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Environment

```bash
cp .env.example .env.local
```

`.env.local` faylını Supabase məlumatlarınızla doldurun.

### 4. İşə salma

```bash
npm run dev
```

Brauzer: [http://localhost:3000](http://localhost:3000)

## Layihə strukturu

```
src/
├── app/                  # Səhifələr (App Router)
│   ├── page.tsx          # Ana səhifə
│   ├── search/           # Axtarış
│   ├── listings/[id]/    # Elan detalı
│   └── api/upload/       # Şəkil yükləmə API
├── components/           # UI komponentləri
├── lib/
│   ├── supabase/         # Supabase client
│   ├── storage/          # S3 upload
│   └── queries/          # DB sorğuları
└── types/                # TypeScript tipləri
```

## Növbəti addımlar

- [x] Supabase Auth (giriş / qeydiyyat)
- [ ] Elan yaratma forması
- [ ] Admin təsdiq paneli
- [ ] Seed elanlar (Instagram icazəli)
- [ ] Mapbox xəritə inteqrasiyası