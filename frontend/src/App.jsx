import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import { HomePage, LoginPage, ProfilePage, RegisterPage, SettingPage } from './pages/index';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

const App = () => {
    const { authUser, authCheck, isCheckingAuth } = useAuthStore();
    const { theme } = useThemeStore();

    useEffect(() => {
        authCheck();
    }, [authCheck]);

    if (isCheckingAuth && !authUser)
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="loading-spinner size-10" />
            </div>
        );

    return (
        <div data-theme={theme}>
            <Navbar />
            <Routes>
                <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
                <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/settings" element={<SettingPage />} />
                <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
