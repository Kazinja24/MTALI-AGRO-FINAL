
# Django Backend Specification — Mtali Agro Traders

A handoff document for the Django backend engineer. The frontend is a TanStack Start (React) app currently wired to Supabase. The Django backend should expose a REST API that the frontend can consume in place of (or alongside) Supabase.

---

## 1. Tech Stack (recommended)

- **Django 5.x** + **Django REST Framework (DRF)**
- **PostgreSQL** (matches current schema)
- **SimpleJWT** (`djangorestframework-simplejwt`) for auth — JWT access + refresh
- **django-cors-headers** — frontend runs on a different origin
- **Pillow** for image handling
- **django-storages** + AWS S3 / Cloudflare R2 / Supabase Storage for product images (public bucket)
- **drf-spectacular** for OpenAPI/Swagger docs
- **python-decouple** / `django-environ` for env config
- **gunicorn** + **whitenoise** for deployment

---

## 2. Apps Layout

```
backend/
  config/            # settings, urls, wsgi
  accounts/          # custom user, roles, JWT auth
  products/          # products + images
  inquiries/         # contact form + product inquiries
  blog/              # field notes
  common/            # shared mixins, permissions, pagination
```

---

## 3. Data Models

### 3.1 accounts.User (custom)
Extend `AbstractUser` so we can switch login to email later.
- `email` (unique, used as login)
- `full_name`
- `phone`
- `is_active`, `date_joined` (default)

### 3.2 accounts.Role
Roles must be a **separate table** (security best practice — never store role on the user row).
- `user` → FK `User` (on_delete=CASCADE)
- `role` → choices: `admin`, `editor`, `user`
- unique together (`user`, `role`)
- Helper: `User.has_role('admin')`

**Bootstrapping**: first registered account is auto-assigned `admin` (mirrors current behaviour). Subsequent users default to `user`.

### 3.3 products.Product
Mirror the current Supabase `products` table.
| Field | Type | Notes |
|---|---|---|
| `id` | UUID PK | `default=uuid4` |
| `name` | CharField(200) | required |
| `slug` | SlugField(unique=True) | auto-generated from name + random suffix |
| `category` | CharField(50) | choices: Foliar / Soluble / Nutrition |
| `description` | TextField(blank=True) | |
| `price` | DecimalField(12,2, null=True) | optional |
| `currency` | CharField(8, default="TZS") | |
| `crops` | ArrayField(CharField) or JSONField | list of crop names |
| `image` | ImageField(upload_to="products/") | stored via django-storages |
| `image_url` | URLField(blank=True) | computed property if using S3 |
| `featured` | Boolean(default=False) | shown on homepage |
| `active` | Boolean(default=True) | hidden from public if False |
| `created_by` | FK User (null=True, SET_NULL) | |
| `created_at`, `updated_at` | auto timestamps | |

### 3.4 inquiries.ContactMessage
Contact form submissions from `/contact`.
- `name`, `phone`, `email`, `subject` (choices), `message`, `created_at`, `handled` (bool)

### 3.5 inquiries.ProductInquiry (optional — "Inquire" button)
- FK `Product`, `name`, `phone`, `email`, `message`, `created_at`

### 3.6 blog.Post (Field Notes)
- `title_en`, `title_sw`, `slug`, `category` (Maize / Tomato / Coffee / …), `excerpt_en`, `excerpt_sw`, `body_en`, `body_sw`, `cover_image`, `published_at`, `is_published`

---

## 4. API Endpoints

Base URL: `/api/v1/`. All JSON. Pagination: DRF `PageNumberPagination` (`?page=`, default 20).

### 4.1 Auth (`/api/v1/auth/`)
| Method | Path | Body | Returns | Auth |
|---|---|---|---|---|
| POST | `register/` | `{email, password, full_name?}` | `{user, access, refresh}` | public |
| POST | `login/` | `{email, password}` | `{access, refresh}` | public |
| POST | `refresh/` | `{refresh}` | `{access}` | public |
| POST | `logout/` | `{refresh}` | 204 | auth |
| GET | `me/` | — | `{id, email, full_name, roles: ["admin"]}` | auth |

JWT in `Authorization: Bearer <token>`.

### 4.2 Products (`/api/v1/products/`)
| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `products/` | list **active** products, filters: `?category=Foliar&crop=Maize&featured=true&search=` | public |
| GET | `products/{slug}/` | retrieve | public |
| GET | `admin/products/` | list ALL (active + hidden) | admin/editor |
| POST | `admin/products/` | create (multipart for image) | admin/editor |
| PATCH | `admin/products/{id}/` | update | admin/editor |
| POST | `admin/products/{id}/toggle-active/` | flip active | admin/editor |
| DELETE | `admin/products/{id}/` | delete | admin only |

### 4.3 Inquiries (`/api/v1/inquiries/`)
| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `contact/` | submit contact form | public (rate-limited) |
| POST | `product/` | submit product inquiry | public (rate-limited) |
| GET | `admin/contact/` | list messages | admin/editor |
| GET | `admin/product/` | list product inquiries | admin/editor |

### 4.4 Blog (`/api/v1/blog/`)
| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `posts/` | list published posts | public |
| GET | `posts/{slug}/` | retrieve | public |
| `admin/posts/` CRUD | full CRUD | admin/editor |

### 4.5 Health & Docs
- `GET /api/v1/health/` → `{status: "ok"}`
- `GET /api/schema/` + `GET /api/docs/` (drf-spectacular)

---

## 5. Permissions

Custom DRF permission classes:
- `IsAdmin` — `request.user.has_role('admin')`
- `IsAdminOrEditor` — admin or editor
- `IsAuthenticatedReadOnly` for some endpoints

Apply at viewset level. The frontend currently calls Supabase RLS — replicate that logic in DRF permissions:
- Public can SELECT only where `active=True`
- Admin/editor: full read; admin: full write/delete; editor: write but no delete

---

## 6. Validation Rules (matches frontend)

- Product name: 1–200 chars, required
- Slug auto-generated, unique
- Category must be one of `Foliar`, `Soluble`, `Nutrition`
- Price ≥ 0 if provided
- Image: max 5 MB, types: jpg/jpeg/png/webp
- Crops: list of strings, max 20 items, each 1–50 chars
- Contact message: name 1–100, email valid, message 1–1000
- Password: min 8 chars; recommend HIBP check via `django-zxcvbn` or pwned-passwords API

---

## 7. File Uploads

Endpoint accepts `multipart/form-data` for `POST/PATCH admin/products/`.
- Field name: `image`
- Backend stores via django-storages → returns absolute public URL in `image_url`
- Bucket should be public-read (frontend uses raw `<img src>`)

---

## 8. Frontend Integration Contract

To swap Supabase for Django the frontend will need:

1. A new `src/integrations/api/client.ts` — thin fetch wrapper that:
   - Reads `VITE_API_BASE_URL`
   - Attaches `Authorization: Bearer <access>` from localStorage
   - Auto-refreshes on 401 using `/auth/refresh/`
2. Updated calls in:
   - `src/routes/login.tsx` → `POST /auth/login` & `/auth/register`
   - `src/routes/admin.tsx` → product CRUD + image upload
   - `src/routes/products.tsx` → `GET /products/?active=true`
   - `src/routes/contact.tsx` → `POST /inquiries/contact/`

Response shape the frontend already expects (keep field names!):
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

- `CORS_ALLOWED_ORIGINS`: preview URL, custom domain, `localhost:5173`
- `CSRF_TRUSTED_ORIGINS`: same
- HTTPS only in prod (`SECURE_SSL_REDIRECT=True`)
- DRF throttling: `AnonRateThrottle 60/min`, `UserRateThrottle 1000/hr`
- Rate-limit `/auth/login` and `/inquiries/contact` more strictly (e.g. 5/min)
- Stronger limits on registration to prevent abuse
- Input validation via DRF serializers + django's built-in validators
- Image upload: validate MIME + dimensions server-side, never trust client
- Store secrets in env, never in repo

---

## 10. Settings to Provide

Backend `.env` needs:
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
```

Frontend `.env`:
```
VITE_API_BASE_URL=https://api.mtaliagro.co.tz/api/v1
```

---

## 11. Deliverables Checklist

- [ ] Django project scaffold with apps above
- [ ] Custom `User` + `Role` model + migration
- [ ] Product model, serializer, admin & public viewsets
- [ ] JWT auth endpoints (`register`, `login`, `refresh`, `me`, `logout`)
- [ ] File upload working with public URL response
- [ ] Contact form endpoint (+ email notification to `martinernest107@gmail.com`)
- [ ] Blog endpoints (optional MVP, can defer)
- [ ] CORS configured for the Lovable preview + production domains
- [ ] OpenAPI schema at `/api/docs/`
- [ ] Seed script: create first admin (`azamabubaka511@gmail.com`) and the 5 default products listed in `src/routes/products.tsx`
- [ ] README with run/deploy instructions
- [ ] Postman / Bruno collection or OpenAPI for the frontend team

---

## 12. Migration Plan (Supabase → Django)

1. Backend team builds & deploys to a staging URL.
2. Frontend creates `VITE_API_BASE_URL` env + new API client (kept feature-flagged).
3. Switch `admin.tsx`, `products.tsx`, `login.tsx`, `contact.tsx` one page at a time.
4. Export current Supabase product rows → `python manage.py loaddata` import.
5. Remove `@/integrations/supabase/*` imports once parity is reached.

---

## 13. Open Questions for Backend Engineer

1. Hosting target — Render / Railway / Fly / DO?
2. Image storage — AWS S3, R2, or keep Supabase Storage bucket?
3. Email delivery for contact form — SendGrid, SES, Resend?
4. Will the blog be authored in Django admin or via the same `/admin` page on the frontend?

Once this plan is approved, I'll switch to build mode and produce a matching `BACKEND.md` file in the repo plus a typed `src/integrations/api/` client scaffold so the frontend can start consuming the Django endpoints as soon as they're live.
