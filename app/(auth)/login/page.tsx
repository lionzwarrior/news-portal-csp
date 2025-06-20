'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserId } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { id: userId } = getUserId();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post('/api/login', { username, password });
            window.location.href = "/"
        } catch (err) {
            alert('Login failed');
        }
    };

    useEffect(() => {
        if (userId) {
            router.push("/");
        }
    }, [userId, router])

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button
                    type="submit"
                >
                    Login
                </button>
            </form>
        </>
    );
}
