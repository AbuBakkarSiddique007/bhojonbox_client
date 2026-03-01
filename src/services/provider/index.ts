import { API_BASE_URL } from "@/config";

export type Provider = {
    id: string;
    userId?: string;
    storeName?: string;
    description?: string;
    cuisine?: string;
    logo?: string | null;
    address?: string | null;
    phone?: string | null;
    isOpen?: boolean;
    createdAt?: string;
    updatedAt?: string;
    user?: { name?: string; email?: string } | null;
};

export type Meal = {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string | null;
    providerId: string;
};

const base = API_BASE_URL || "https://bhojonbox-server.onrender.com/api";

interface ServerResponse<T = unknown> {
    success?: boolean;
    data?: T;
    message?: string;
}

async function handleRes<T = unknown>(res: Response): Promise<ServerResponse<T> | null> {
    const text = await res.text().catch(() => "");
    let json: unknown = null;
    try {
        json = text ? JSON.parse(text) : null;
    } catch {
        json = null;
    }

    const sr = json as ServerResponse<T> | null;

    if (!res.ok) {
        const msg = (sr && typeof sr.message === "string" ? sr.message : text) || res.statusText || "Request failed";
        throw new Error(msg);
    }

    if (sr && typeof sr.success !== "undefined" && sr.success === false) {
        throw new Error(sr.message || "Request failed");
    }

    return sr;
}

export async function getAllProviders(): Promise<Provider[]> {
    const res = await fetch(`${base}/providers`);
    const data = await handleRes<{ providers?: Provider[] }>(res);
    const providers = data?.data?.providers;
    return Array.isArray(providers) ? providers : [];
}

export async function getProviderById(id: string): Promise<Provider | null> {
    const res = await fetch(`${base}/providers/${id}`);
    const data = await handleRes<{ provider?: Provider }>(res);
    return data?.data?.provider ?? null;
}

export async function getMealsByProvider(id: string, opts?: { page?: number; limit?: number }) {
    const params = new URLSearchParams();
    params.set("provider", id);
    if (opts?.page) params.set("page", String(opts.page));
    if (opts?.limit) params.set("limit", String(opts.limit));
    const url = `${base}/meals?${params.toString()}`;
    const res = await fetch(url);
    const data = await handleRes<{ meals?: Meal[] }>(res);
    return data?.data?.meals ?? [];
}

export default { getAllProviders, getProviderById, getMealsByProvider };
