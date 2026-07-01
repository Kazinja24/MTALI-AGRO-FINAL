# Django Backend Specification — Mtali Agro Traders

Handoff document for the Django backend engineer. The frontend is a TanStack Start (React) app currently wired to Supabase. The Django backend should expose a REST API the frontend can consume in place of Supabase.

---

## 1. Tech Stack

- **Django 5.x** + **Django REST Framework (DRF)**
- **PostgreSQL**
- **SimpleJWT** (`djangorestframework-simplejwt`) — JWT access + refresh
- **django-cors-headers**
- **Pillow** for image handling
- **django-storages** + S3 / R2 for product images (public bucket)
- **drf-spectacular** for OpenAPI/Swagger docs
- **django-environ** for env config
- **gunicorn** + **whitenoise** for deployment

---

## 2. App Layout

```
backend/
  config/       # settings, urls, wsgi
  accounts/     # custom user, roles, JWT auth
  products/     # products + images
  inquiries/    # contact form + product inquiries
  blog/         # field notes
  common/       # shared mixins, permissions, pagination
```

---

## 3. Data Models

### 3.1 accounts.User (custom, extends AbstractUser)
- `email` (unique, login field)
- `full_name`
- `phone`
- `is_active`, `date_joined`

### 3.2 accounts.Role (separate table — security best practice)
- `user` FK → User (CASCADE)
- `role` choices: `admin`, `editor`, `user`
- unique together (`user`, `role`)
- Helper: `User.has_role('admin')`

**Bootstrap**: first registered account → `admin`. Subsequent → `user`.

### 3.3 products.Product
| Field | Type | Notes |
|---|---|---|
| `id` | UUID PK | `default=uuid4` |
| `name` | CharField(200) | required |
| `slug` | SlugField(unique=True) | auto-generated, with random suffix |
| `category` | CharField | choices: Foliar / Soluble / Nutrition |
| `description` | TextField(blank=True) | |
| `price` | DecimalField(12,2, null=True) | |
| `currency` | CharField(8, default="TZS") | |
| `crops` | ArrayField / JSONField | list of crop names |
| `image` | ImageField(upload_to="products/") | via django-storages |
| `image_url` | URLField | computed public URL |
| `featured` | Boolean(default=False) | |
| `active` | Boolean(default=True) | public visibility |
| `created_by` | FK User (null, SET_NULL) | |
| `created_at`, `updated_at` | auto timestamps | |

### 3.4 inquiries.ContactMessage
`name`, `phone`, `email`, `subject` (choices), `message`, `created_at`, `handled` (bool)

### 3.5 inquiries.ProductInquiry
FK `Product`, `name`, `phone`, `email`, `message`, `created_at`

### 3.6 blog.Post
`title_en`, `title_sw`, `slug`, `category`, `excerpt_en`, `excerpt_sw`, `body_en`, `body_sw`, `cover_image`, `published_at`, `is_published`

---

## 4. API Endpoints

Base URL: `/api/v1/`. JSON. DRF `PageNumberPagination` (default 20).

### Auth (`/api/v1/auth/`)
| Method | Path | Body | Returns | Auth |
|---|---|---|---|---|
| POST | `register/` | `{email, password, full_name?}` | `{user, access, refresh}` | public |
| POST | `login/` | `{email, password}` | `{access, refresh}` | public |
| POST | `refresh/` | `{refresh}` | `{access}` | public |
| POST | `logout/` | `{refresh}` | 204 | auth |
| GET  | `me/`     | — | `{id, email, full_name, roles: ["admin"]}` | auth |

JWT in `Authorization: Bearer <token>`.

### Products (`/api/v1/products/`)
| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `products/` | list active, filters: `?category=&crop=&featured=&search=` | public |
| GET | `products/{slug}/` | retrieve | public |
| GET | `admin/products/` | list ALL | admin/editor |
| POST | `admin/products/` | create (multipart for image) | admin/editor |
| PATCH | `admin/products/{id}/` | update | admin/editor |
| POST | `admin/products/{id}/toggle-active/` | flip active | admin/editor |
| DELETE | `admin/products/{id}/` | delete | admin |

### Inquiries (`/api/v1/inquiries/`)
| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `contact/` | contact form | public (rate-limited) |
| POST | `product/` | product inquiry | public (rate-limited) |
| GET  | `admin/contact/` | list | admin/editor |
| GET  | `admin/product/` | list | admin/editor |

### Blog (`/api/v1/blog/`)
- `GET posts/` — list published
- `GET posts/{slug}/` — retrieve
- `admin/posts/` — full CRUD (admin/editor)

### Health & Docs
- `GET /api/v1/health/` → `{status: "ok"}`
- `GET /api/schema/` + `GET /api/docs/` (drf-spectacular)

---

## 5. Permissions

DRF permission classes:
- `IsAdmin`, `IsAdminOrEditor`, `IsAuthenticatedReadOnly`

Mirror Supabase RLS:
- Public SELECT only where `active=True`
- Admin: full CRUD; Editor: read + write, no delete

---

## 6. Validation

- Product name 1–200; slug auto, unique
- Category ∈ {Foliar, Soluble, Nutrition}
- Price ≥ 0
- Image ≤ 5 MB, jpg/jpeg/png/webp
- Crops: list ≤ 20 items, each 1–50 chars
- Contact: name 1–100, valid email, message 1–1000
- Password: min 8 chars; HIBP check recommended

---

## 7. File Uploads

`multipart/form-data` for `POST/PATCH admin/products/`. Field: `image`. Returns absolute public `image_url`. Bucket: public-read.

---

## 8. Frontend Integration Contract

Frontend will add:
1. `src/integrations/api/client.ts` — fetch wrapper:
   - Reads `VITE_API_BASE_URL` and falls back to `VITE_API_URL`
   - Attaches `Authorization: Bearer <access>` from localStorage
   - Auto-refresh on 401 via `/auth/refresh/`
2. Updated callers:
   - `src/routes/login.tsx` → `/auth/login`, `/auth/register`
   - `src/routes/admin.tsx` → product CRUD + image upload
   - `src/routes/products.tsx` → `GET /products/`
   - `src/routes/contact.tsx` → `POST /inquiries/contact/`

**Response shape (keep field names!):**
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "category": "Foliar|Soluble|Nutrition",
  "description": "string|null",
  "price": "number|null",
  "currency": "TZS",
  "crops": ["Maize", "Tomato"],
  "image_url": "https://.../image.jpg",
  "featured": false,
  "active": true,
  "created_at": "ISO-8601"
}
```

---

## 9. CORS & Security

- Use `config.settings.development` locally and `config.settings.production` on Railway.
- `CORS_ALLOWED_ORIGINS`: preview URL, custom domain, `localhost:5173`
- `CSRF_TRUSTED_ORIGINS`: same exact origins, including the full `https://<preview>.vercel.app` URL
- `ALLOWED_HOSTS`: Railway backend host plus any custom API domain
- `SECURE_SSL_REDIRECT=True` in prod
- DRF throttling: `AnonRateThrottle 60/min`, `UserRateThrottle 1000/hr`
- Stricter on `/auth/login` and `/inquiries/contact` (~5/min)
- Server-side image MIME + dimension validation
- Secrets in env only

---

## 10. Environment

**Backend `.env`:**
```
DJANGO_SECRET_KEY=
DJANGO_DEBUG=False
DATABASE_URL=postgres://...
ALLOWED_HOSTS=api.mtaliagro.co.tz
CORS_ALLOWED_ORIGINS=https://mtaliagro.co.tz,https://preview-...lovable.app
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=mtali-product-images
AWS_S3_REGION_NAME=
JWT_ACCESS_LIFETIME_MIN=30
JWT_REFRESH_LIFETIME_DAYS=7
DEFAULT_FROM_EMAIL=no-reply@mtaliagro.co.tz
CONTACT_NOTIFY_EMAIL=martinernest107@gmail.com
```

**Frontend `.env`:**
```
VITE_API_BASE_URL=https://api.mtaliagro.co.tz/api/v1
```

For preview deploys, use the exact frontend origin in the backend env:
```
CORS_ALLOWED_ORIGINS=https://mtaliagro.co.tz,https://<preview>.vercel.app
CSRF_TRUSTED_ORIGINS=https://mtaliagro.co.tz,https://<preview>.vercel.app
ALLOWED_HOSTS=api.mtaliagro.co.tz
DJANGO_DEBUG=False
DATABASE_URL=postgres://...
```

Recommended Railway start command:
```
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

---

## 11. Deliverables Checklist

- [ ] Django project scaffold with apps above
- [ ] Custom `User` + `Role` model + migration
- [ ] Product model, serializer, admin + public viewsets
- [ ] JWT auth endpoints (register, login, refresh, me, logout)
- [ ] Image upload returning public URL
- [ ] Contact form endpoint + email notification to `martinernest107@gmail.com`
- [ ] Blog endpoints (optional MVP)
- [ ] CORS configured for Lovable preview + production domains
- [ ] OpenAPI schema at `/api/docs/`
- [ ] Seed script: first admin (`azamabubaka511@gmail.com`) + the 5 default products in `src/routes/products.tsx`
- [ ] README with run/deploy instructions
- [ ] Postman/Bruno collection or OpenAPI for frontend team

---

## 12. Migration Plan (Supabase → Django)

1. Backend deployed to staging.
2. Frontend adds `VITE_API_BASE_URL` + new API client (feature-flagged).
3. Switch `admin.tsx`, `products.tsx`, `login.tsx`, `contact.tsx` one page at a time.
4. Export Supabase product rows → `python manage.py loaddata`.
5. Remove `@/integrations/supabase/*` once parity is reached.

---

## 13. Open Questions

1. Hosting target — Render / Railway / Fly / DO?
2. Image storage — S3, R2, or keep Supabase Storage?
3. Email delivery — SendGrid, SES, Resend?
4. Blog authored via Django admin or the frontend `/admin` page?

---

## 14. Reference: Current Frontend Pages

| Route | Calls today (Supabase) | Will call (Django) |
|---|---|---|
| `/` | — (static) | `GET /products/?featured=true` (optional) |
| `/products` | `from('products').select('*').eq('active', true)` | `GET /products/` |
| `/contact` | (form not wired) | `POST /inquiries/contact/` |
| `/login` | `auth.signInWithPassword`, `auth.signUp` | `POST /auth/login`, `POST /auth/register` |
| `/admin` | products CRUD + storage upload + role check | `GET/POST/PATCH/DELETE /admin/products/`, `GET /auth/me` |

**Contact info (already in `src/lib/i18n.tsx`):**
- Phone: `255 75331533`
- Email: `martinernest107@gmail.com`
- HQ: Plot 21, Sokoine Road, Arusha, Tanzania
