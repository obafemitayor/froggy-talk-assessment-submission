import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';

function RequireAuth({ children }: { children: ReactNode }) {
    const token = localStorage.getItem('billing.jwt');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/home"
                    element={
                        <RequireAuth>
                            <HomePage />
                        </RequireAuth>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
