'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/context/UserContext';
import { User } from '@/app/global';

export default function RegisterPage() {
    const { id: userId } = getUserId();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const username = formData.get("username");
        const password = formData.get("password");

        if (!users.filter(user => user.username == username)[0]) {
            try {
                await axios.post('http://localhost:5000/user', { name: String(name), username: String(username), password: String(password), userType: "user", bookmarks: [] });
                router.push('login');
            }
            catch (err) {
                alert("Register failed")
            }
        } else {
            alert("User with that username already existed")
        }
    };

    useEffect(() => {
        if (userId) {
            router.push("/");
        }

        const fetchUsers = async () => {
            const res = await axios.get<User[]>(`http://localhost:5000/user`);
            setUsers(res.data);
        };
        fetchUsers();
    }, [userId, router])

    return (
        <>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label
                        htmlFor="Name"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
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
                        name="password"
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
                    Register
                </button>
            </form>
        </>
    );
}
