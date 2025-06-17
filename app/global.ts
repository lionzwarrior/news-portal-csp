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
    comments: {id: string, text: string}[]
}

export interface UpdateNews {
  news: News;
  user: User;
  setNews: React.Dispatch<React.SetStateAction<any[]>>;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export type User = {
    id: string,
    name: string,
    userType: string,
    username: string,
    password: string,
    bookmarks: string[]
}
