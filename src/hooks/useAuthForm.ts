'use client';

import { loginUser, signupUser } from "@/lib/auth";
import { useState } from "react";

type AuthMode = "login" | "signup";

type UseAuthFormOptions = {
    mode: AuthMode;
    onSuccess: () => void;
}

export default function useAuthForm({ mode, onSuccess }: UseAuthFormOptions) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const result = mode === "login" ? loginUser(email, password) : signupUser(email, password);

        if (!result.success) {
            setError(result.error);
            return;
        }

        onSuccess();
    }

    return{
        email,
        password,
        error,
        setEmail,
        setPassword,
        handleSubmit
    }
}