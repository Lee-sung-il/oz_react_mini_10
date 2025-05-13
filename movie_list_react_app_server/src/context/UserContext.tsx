// context/UserContext.tsx
import React, { createContext, useContext } from 'react';

export const UserContext = createContext<{
    user: { email: string } | null;
    setUser: React.Dispatch<React.SetStateAction<{ email: string } | null>>;
}>({ user: null, setUser: () => {} });

export const useUser = () => useContext(UserContext);