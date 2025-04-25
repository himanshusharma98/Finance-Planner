import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import SavingGoal from "./pages/SavingGoal"; // ✅ Import component
import RecurringTransactionPage from "./pages/RecurringTransactionPage";
import ProtectedLayout from "./pages/ProtectedLayout";

const App = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, []);

    const handleLogin = () => {
        const newToken = localStorage.getItem("token");
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
                <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
                <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <SignUp />} />

                {token && (
                    <Route element={<ProtectedLayout onLogout={handleLogout} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/saving-goals" element={<SavingGoal />} /> {/* ✅ Add this */}
                        <Route path="/recurring-transactions" element={<RecurringTransactionPage />} />
                    </Route>
                )}

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
