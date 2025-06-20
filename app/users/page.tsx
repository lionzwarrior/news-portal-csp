"use client"

import { useEffect, useState } from 'react';
import { User } from '../global';
import axios from 'axios';
import { getUserId } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

async function getUsers() {
    const res = await axios.get("http://localhost:5000/user");
    return res.data;
}

export default function UsersPage() {
    const userId = getUserId().id;
    const [Users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState({ name: "", username: "", password: "", userType: "user", bookmarks: [] });
    const [editId, setEditId] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(true);


    async function fetchUsers() {
        const users: User[] = await getUsers();
        setUsers(users);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editId) {
            if (!Users.filter(user => user.username == formData.username && user.id != editId)[0]) {
                await axios.put(`http://localhost:5000/user/${editId}`, formData);
            } else {
                alert("A user with this username already existed")
            }

        } else {
            if (!Users.filter(user => user.username == formData.username)[0]) {
                await axios.post('http://localhost:5000/user', formData);
            } else {
                alert("A user with this username already existed")
            }

        }
        setFormData({ name: '', username: '', password: '', userType: "user", bookmarks: [] });
        setEditId("");
        fetchUsers();
    };

    const handleEdit = (item: User) => {
        setEditId(item.id);
        setFormData({ name: item.name, username: item.username, password: item.password, userType: "user", bookmarks: [] });
    };

    const handleDelete = async (id: string) => {
        await axios.delete(`http://localhost:5000/user/${id}`);
        fetchUsers();
    };

    useEffect(() => {
        if (!userId) {
            router.push('/');
            return;
        }

        const fetchUserAndData = async () => {
            try {
                const res = await axios.get<User>(`http://localhost:5000/user/${userId}`);
                if (res.data?.userType !== 'admin') {
                    router.push('/');
                    return;
                }
                await fetchUsers();
            } catch (error) {
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndData();
    }, [userId, router]);


    return loading ? (<p>Loading...</p>) : (<div style={{ padding: '2rem' }}>
        <h2>Admin - Kelola User</h2>
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                placeholder="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
            />
            <input
                type='text'
                placeholder="username"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
            />
            <input
                type='password'
                placeholder="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
            />
            <button type="submit">{editId ? 'Update' : 'Tambah'} User</button>
        </form>

        <ul>
            {Users.map(item => (
                <li key={item.id}>
                    <strong>{item.name}</strong> - {item.username}
                    {item.id == userId ? "" : <><button onClick={() => handleEdit(item)}>Edit</button>
                        <button onClick={() => handleDelete(item.id)}>Hapus</button></>}

                </li>
            ))}
        </ul>
    </div>)

}
