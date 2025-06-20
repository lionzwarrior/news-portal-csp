'use client';

import { createContext, useContext, ReactNode } from 'react';

type UserContextType = {
    id: string | null;
};

const UserContext = createContext<UserContextType>({ id: null });

export const getUserId = () => useContext(UserContext);

export function UserProvider({
    children,
    value,
}: {
    children: ReactNode;
    value: UserContextType;
}) {
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
