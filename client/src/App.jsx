import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import UserContext from "./contexts/UserContext";
import axios from "./config/axios";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

const App = () => {
    const [user, setUser] = useState(null);
    const [todos, setTodos] = useState([]);

    const [loading, setLoading] = useState(true);

    useState(() => {
        const localToken = localStorage.getItem("token");
        if (!localToken) {
            setLoading(false);
        } else {
            axios
                .get("/users")
                .then((res) => {
                    if (res.code) {
                        setLoading(false);
                    } else {
                        toast.success("Logged in!");
                        if (res.user.todos) {
                            setTodos(res.user.todos);
                            res.user.todos = undefined;
                        }
                        setUser(res.user);
                    }
                })
                .catch((err) => {
                    localStorage.removeItem("token"); // TODO: uncomment this line
                    console.log("Unable to get user from token: ", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);

    return (
        <div className="flex h-screen w-full flex-col font-sans antialiased">
            <Toaster position="top-left" />
            {loading && (
                <div className="flex h-full items-center justify-center">
                    <p className="text-xl sm:text-2xl md:text-3xl">
                        Loading...
                    </p>
                </div>
            )}

            <UserContext.Provider value={{ user, setUser, todos, setTodos }}>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        <Route
                            path="/"
                            element={
                                <RequireAuth>
                                    <DashboardPage />
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <RequireAuth>
                                    <ProfilePage />
                                </RequireAuth>
                            }
                        />

                        {/* 404 route */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </UserContext.Provider>
        </div>
    );
};

export default App;
