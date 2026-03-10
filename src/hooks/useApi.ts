const TOKEN_KEY = "faredrop_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export async function login(pin: string): Promise<boolean> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  if (!res.ok) return false;
  const { token } = await res.json();
  localStorage.setItem(TOKEN_KEY, token);
  return true;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    logout();
    window.location.reload();
    throw new Error("Unauthorized");
  }
  return res;
}
