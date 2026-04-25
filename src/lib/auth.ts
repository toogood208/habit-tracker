import { Session, User } from "../types/auth";
import {
    getStoredSession,
    getStoredUsers,
    setStoredSession,
    setStoredUsers
} from "./storage";

type AuthResut = {
    success: boolean;
    error: string | null;
    session: Session | null;
}

function createId(): string {
    return crypto.randomUUID();
}

function createTimestamp(): string {
  return new Date().toISOString();
}

export function signupUser(
    email: string,
    password: string
): AuthResut {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
        return {
            success: false,
            error: "Email and password are required",
            session: null
        };
    }

    const users = getStoredUsers();
    const existingUser = users.find(user => user.email === normalizedEmail);

    if (existingUser) {
        return {
            success: false,
            error: "User already exists",
            session: null
        }
    }

    const newUser: User = {
        id: createId(),
        email: normalizedEmail,
        password: normalizedPassword,
        createdAt: createTimestamp(),
    }

    const newSession: Session = {
        userId: newUser.id,
        email: newUser.email,
    }

    setStoredUsers([...users, newUser]);
    setStoredSession(newSession);

    return {
        success: true,
        error: null,
        session: newSession
    }

}

export function loginUser(
    email: string,
    password: string
): AuthResut {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const users = getStoredUsers();
    const existingUser = users.find(user => user.email === normalizedEmail && user.password === normalizedPassword);

    if (!existingUser) {
        return {
            success: false,
            error: "Invalid email or password",
            session: null
        }
    }

    const newSession: Session = {
        userId: existingUser.id,
        email: existingUser.email,
    }

    setStoredSession(newSession);

    return {
        success: true,
        error: null,
        session: newSession
    }

}

export function logoutUser(): void {
    setStoredSession(null);
}

export function getActiveSession(): Session | null {
    return getStoredSession();
}

export function isAuthenticated(): boolean {
    return getActiveSession() !== null;
}

