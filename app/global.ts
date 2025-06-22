import { ReactNode } from "react";

export const categories = ['U.S. NEWS', 'POLITICS', 'WORLD NEWS', 'ENTERTAINMENT', 'PARENTING', 'FOOD & DRINK', 'SPORTS', 'CRIME', 'ENVIRONMENT', 'BLACK VOICES', 'CULTURE & ARTS', 'TECH'];

export type News = {
    id: string,
    title: string,
    description: string,
    body: string,
    category: string,
    author: string,
    url: string,
    image: string,
    likes: number,
    bookmarks: number,
    comments: {
        username: ReactNode;id: string, text: string
}[]
}

export type User = {
    id: string,
    name: string,
    userType: string,
    username: string,
    password: string,
    bookmarks: string[]
}

export type Comment = {
  newsId: string;
  username: string;
  text: string;
  createdAt: string;
  id: string;
};
