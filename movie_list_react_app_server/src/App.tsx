import { useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import SearchPreview from './components/SearchPreview';
import {Layout} from "./components/Layout.tsx";
import RegisterPage from "./User/RegisterPage.tsx";
import LoginPage from "./User/LoginPage.tsx";
import {UserContext} from "./context/UserContext.tsx"; // new layout with NavBar

function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved === "true";
    });

    const [user, setUser] = useState<{ email: string } | null>(null);
    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newValue = !prev;
            localStorage.setItem("darkMode", String(newValue));
            return newValue;
        });
    };


    return (
        <div>
            <UserContext.Provider value={{ user, setUser }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>}>
                        <Route index element={<MovieList isDarkMode={isDarkMode}/>}/>
                        <Route path="/details/:movieId" element={<MovieDetail isDarkMode={isDarkMode}/>}/>
                        <Route path="/search" element={<SearchPreview isDarkMode={isDarkMode}/>}/>
                        <Route path="/register" element={<RegisterPage isDarkMode={isDarkMode}/>}/>
                        <Route path="/login" element={<LoginPage isDarkMode={isDarkMode} />} />  {/* ✅ 이거 추가 */}
                    </Route>
                </Routes>
            </Router>
            </UserContext.Provider>
        </div>
    );
}

export default App;