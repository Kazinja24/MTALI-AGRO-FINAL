export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export type BackendUser = {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  is_staff?: boolean;
};

export type AuthResponse = {
  user: BackendUser;
  access: string;
  refresh: string;
};

export type BackendProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: string | null;
  currency: string;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  crops: { id: string; name: string }[];
  created_at: string;
};

export type BlogPost = {
  id: string;
  title_en: string;
  title_sw?: string | null;
  slug: string;
  category: string;
  excerpt_en?: string | null;
  excerpt_sw?: string | null;
  body_en: string;
  body_sw?: string | null;
  cover_image_url?: string | null;
  published_at?: string | null;
};

export type ProductPayload = {
  name: string;
  category: string;
  description?: string | null;
  price?: string | null;
  currency?: string;
  featured: boolean;
  active: boolean;
  crops?: string[];
  image?: File | null;
};

export type ContactMessagePayload = {
  name: string;
  phone?: string;
  email: string;
  subject: "General" | "Sales" | "Support" | "Partnership";
  message: string;
};

export type ContactMessage = ContactMessagePayload & {
  id: string;
  created_at: string;
};

export type ProductInquiry = {
  id: string;
  product: string;
  name: string;
  phone?: string | null;
  email: string;
  message: string;
  created_at: string;
};

export type MediaAsset = {
  id: string;
  title: string;
  file_url: string | null;
  alt_text?: string | null;
  created_at: string;
};

export type SiteSetting = {
  id: string;
  key: string;
  label?: string | null;
  value?: string | null;
  updated_at: string;
};

function getAccessToken() {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.localStorage.getItem("mtali_api_token") || undefined;
}

function getRefreshToken() {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.localStorage.getItem("mtali_api_refresh") || undefined;
}

export function setAccessToken(token?: string, refresh?: string) {
  if (typeof window === "undefined") {
    return;
  }
  if (token) {
    window.localStorage.setItem("mtali_api_token", token);
  } else {
    window.localStorage.removeItem("mtali_api_token");
  }

  if (refresh) {
    window.localStorage.setItem("mtali_api_refresh", refresh);
  }
}

export function clearAccessToken() {
  setAccessToken(undefined);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("mtali_api_refresh");
  }
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return undefined;

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const responseBody = await parseResponseBody(response);

  if (
    !response.ok ||
    !responseBody ||
    typeof responseBody !== "object" ||
    !("access" in responseBody)
  ) {
    clearAccessToken();
    return undefined;
  }

  const access = String(responseBody.access);
  setAccessToken(access);
  return access;
}

async function parseResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const response = await runApiFetch(url, options, getAccessToken());
  let responseBody = await parseResponseBody(response);

  if (response.status === 401 && getRefreshToken()) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      const retryResponse = await runApiFetch(url, options, newAccessToken);
      responseBody = await parseResponseBody(retryResponse);
      return handleApiResponse<T>(retryResponse, responseBody);
    }
  }

  return handleApiResponse<T>(response, responseBody);
}

async function runApiFetch(url: string, options: RequestInit, accessToken?: string) {
  const headers = new Headers(options.headers ?? {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let body = options.body;
  if (body != null && !(body instanceof FormData) && typeof body !== "string") {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  return fetch(url, {
    ...options,
    headers,
    body,
  });
}

function handleApiResponse<T>(response: Response, responseBody: unknown) {
  if (!response.ok) {
    const errorMessage =
      (responseBody &&
      typeof responseBody === "object" &&
      "detail" in responseBody &&
      typeof responseBody.detail === "string"
        ? responseBody.detail
        : responseBody &&
            typeof responseBody === "object" &&
            "message" in responseBody &&
            typeof responseBody.message === "string"
          ? responseBody.message
          : typeof responseBody === "string"
            ? responseBody
            : response.statusText) || "Request failed.";
    throw new Error(errorMessage);
  }

  return responseBody as T;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/v1/auth/register/", {
    method: "POST",
    body: payload,
  });
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/v1/auth/login/", {
    method: "POST",
    body: payload,
  });
}

export async function fetchMe(): Promise<BackendUser> {
  return apiFetch<BackendUser>("/api/v1/auth/me/");
}

export async function getProducts(): Promise<BackendProduct[]> {
  return apiFetch<BackendProduct[]>("/api/v1/products/");
}

export async function getAdminProducts(): Promise<BackendProduct[]> {
  return apiFetch<BackendProduct[]>("/api/v1/products/admin/");
}

export async function createProduct(payload: ProductPayload): Promise<BackendProduct> {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("category", payload.category);
  if (payload.currency != null) {
    formData.append("currency", payload.currency);
  }
  formData.append("featured", payload.featured ? "true" : "false");
  formData.append("active", payload.active ? "true" : "false");

  if (payload.description != null) {
    formData.append("description", payload.description);
  }

  if (payload.price != null) {
    formData.append("price", payload.price);
  }

  if (payload.image) {
    formData.append("image", payload.image);
  }

  if (payload.crops) {
    for (const crop of payload.crops) {
      formData.append("crops", crop);
    }
  }

  return apiFetch<BackendProduct>("/api/v1/products/admin/", {
    method: "POST",
    body: formData,
  });
}

export async function updateProductStatus(id: string, active: boolean): Promise<BackendProduct> {
  return apiFetch<BackendProduct>(`/api/v1/products/admin/${id}/`, {
    method: "PATCH",
    body: { active },
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/products/admin/${id}/`, {
    method: "DELETE",
  });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return apiFetch<BlogPost[]>("/api/v1/blog/");
}

export async function getAdminContactMessages(): Promise<ContactMessage[]> {
  return apiFetch<ContactMessage[]>("/api/v1/inquiries/admin/contact/");
}

export async function getAdminProductInquiries(): Promise<ProductInquiry[]> {
  return apiFetch<ProductInquiry[]>("/api/v1/inquiries/admin/product/");
}

export async function getAdminMediaAssets(): Promise<MediaAsset[]> {
  return apiFetch<MediaAsset[]>("/api/v1/common/admin/media/");
}

export async function createMediaAsset(payload: {
  title: string;
  file: File;
  alt_text?: string | null;
}): Promise<MediaAsset> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("file", payload.file);
  if (payload.alt_text) {
    formData.append("alt_text", payload.alt_text);
  }

  return apiFetch<MediaAsset>("/api/v1/common/admin/media/", {
    method: "POST",
    body: formData,
  });
}

export async function deleteMediaAsset(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/common/admin/media/${id}/`, {
    method: "DELETE",
  });
}

export async function getAdminSettings(): Promise<SiteSetting[]> {
  return apiFetch<SiteSetting[]>("/api/v1/common/admin/settings/");
}

export async function getSiteSettings(): Promise<SiteSetting[]> {
  return apiFetch<SiteSetting[]>("/api/v1/common/settings/");
}

export async function createSiteSetting(payload: {
  key: string;
  label?: string | null;
  value?: string | null;
}): Promise<SiteSetting> {
  return apiFetch<SiteSetting>("/api/v1/common/admin/settings/", {
    method: "POST",
    body: payload,
  });
}

export async function updateSiteSetting(id: string, value: string): Promise<SiteSetting> {
  return apiFetch<SiteSetting>(`/api/v1/common/admin/settings/${id}/`, {
    method: "PATCH",
    body: { value },
  });
}

export async function deleteSiteSetting(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/common/admin/settings/${id}/`, {
    method: "DELETE",
  });
}

export async function getVisitCount(): Promise<number> {
  const response = await apiFetch<{ count: number }>("/api/v1/common/analytics/visit/");
  return response.count;
}

export async function recordVisit(): Promise<number> {
  const response = await apiFetch<{ count: number }>("/api/v1/common/analytics/visit/", {
    method: "POST",
  });
  return response.count;
}

export async function getAdminUsers(): Promise<BackendUser[]> {
  return apiFetch<BackendUser[]>("/api/v1/auth/admin/users/");
}

export async function submitContactMessage(payload: ContactMessagePayload): Promise<void> {
  await apiFetch<void>("/api/v1/inquiries/contact/", {
    method: "POST",
    body: payload,
  });
}

export async function logoutUser(): Promise<void> {
  clearAccessToken();
}
