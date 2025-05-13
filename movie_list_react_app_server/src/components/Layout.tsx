import NavBar from "./NavBar.tsx";
import { Outlet } from "react-router-dom";

interface LayoutProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export function Layout({ isDarkMode, toggleDarkMode }: LayoutProps) {
    return (
        <div className={isDarkMode ? 'bg-black text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
            <NavBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main>
                <Outlet context={{ isDarkMode, toggleDarkMode }} />
            </main>
        </div>
    );
}