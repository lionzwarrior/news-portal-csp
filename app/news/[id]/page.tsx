"use client"

import { SetStateAction, useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import CommentSection from '../../../components/comment-section';
import { News, User } from '@/app/global';

async function getUser() {
    const res = await axios.get('http://localhost:5000/user/1');
    return res.data;
}

export default function NewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const [user, setUser] = useState<User>();
    const [newsList, setNewsList] = useState<News[]>([]);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    async function fetchUser() {
        const user: User = await getUser();
        setUser(user);
    }

    async function fetchNews(id: string) {
        const res = await axios.get(`http://localhost:5000/news/${id}`);
        setNewsList([res.data]);
    }

    useEffect(() => {
        fetchUser()
        fetchNews(id)
    });

    if (!newsList) return <p>Loading...</p>;

    const handleLike = () => {
        if (!liked) {
            setLiked(true);
        }
    };

    const handleBookmark = () => {
        setBookmarked(prev => !prev);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{newsList[0].title}</h2>
            <p>{newsList[0].body}</p>
            <button onClick={handleLike} disabled={liked}>{liked ? 'Liked ❤️' : 'Like'}</button>
            <button onClick={handleBookmark} style={{ marginLeft: '1rem' }}>
                {bookmarked ? 'Bookmarked 🔖' : 'Bookmark'}
            </button>

            <CommentSection news={newsList[0]} user={user ? user : {
                id: "",
                name: "",
                userType: "",
                username: "",
                password: "",
                bookmarks: []
            }} setNews={setNewsList} />
        </div>
    );
}
