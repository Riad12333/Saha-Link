import { api } from './api';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: 'patient' | 'doctor' | 'admin';
    phone?: string;
    doctorDetails?: {
        specialty: string;
        city: string;
    };
}

interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

class AuthService {
    private tokenKey = 'medecine_app_token';
    private userKey = 'medecine_app_user';

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(api.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data: AuthResponse = await response.json();
        this.setSession(data);
        return data;
    }

    async register(name: string, email: string, password: string, role: string, phone: string, doctorDetails?: { specialty: string, city: string }): Promise<AuthResponse> {
        const response = await fetch(api.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role,
                phone,
                ...(doctorDetails || {})
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        const data: AuthResponse = await response.json();
        this.setSession(data);
        return data;
    }

    async getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const response = await fetch(api.getMe, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                this.logout();
                return null;
            }

            return await response.json();
        } catch (error) {
            this.logout();
            return null;
        }
    }

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
            this.deleteCookie('token');
            this.deleteCookie('role');
        }
    }

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
    }

    setSession(data: AuthResponse) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.tokenKey, data.token);
            localStorage.setItem(this.userKey, JSON.stringify(data));
            this.setCookie('token', data.token, 7); // 7 days
            this.setCookie('role', data.role, 7);
        }
    }

    getUser() {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem(this.userKey);
            return user ? JSON.parse(user) : null;
        }
        return null;
    }

    setUser(userData: any) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.userKey, JSON.stringify(userData));
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private setCookie(name: string, value: string, days: number) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    private deleteCookie(name: string) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}

export const authService = new AuthService();
export default authService;
