import { useContext, useEffect, useState} from "react";
import axios from "../../config/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import { toast } from 'react-hot-toast';


const SignupPage = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const [state, setState] = useState({
        email: "",
        password: "",
        username: "",
    });

    const formSubmit = (e) => {
        e.preventDefault();

        axios
            .post("/auth/signup", {
                email: state.email,
                password: state.password,
                username: state.username,
            })
            .then((res) => {
                if (res.user){
                    setUser({
                        ...res.user,
                        todos: undefined,
                        token: res.token,
                    });
                    localStorage.setItem("token", res.token);
                }
                navigate(from, { replace: true });
            })
            .catch((err) => {
                console.log("Failed to sign up:", err);
                if(err.code){
                    toast.error(err.message);
                }else{
                    toast.error("Failed to sign up");
                }
            });
    };

    useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, []);

    return (
        <div className="flex-grow">
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Signup
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-green-600 hover:text-green-500"
                            >
                                Login
                            </Link>
                        </p>
                    </div>

                    <div className="mt-5 md:col-span-2 md:mt-0">
                        <form method="POST" onSubmit={formSubmit}>
                            <div className="overflow-hidden shadow-md sm:rounded-md">
                                <div className="bg-white px-4 pt-5 sm:px-6">
                                    <div className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6">
                                            <label
                                                htmlFor="username"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                autoComplete="username"
                                                className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                                placeholder="Username"
                                                onChange={(e) =>
                                                    setState({
                                                        ...state,
                                                        username: e.target.value,
                                                    })
                                                }
                                                required
                                                value={state.username}
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label
                                                htmlFor="email-address"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Email address
                                            </label>
                                            <input
                                                type="text"
                                                name="email-address"
                                                autoComplete="email"
                                                className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                                placeholder="Email address"
                                                required
                                                onChange={(e) =>
                                                    setState({
                                                        ...state,
                                                        email: e.target.value,
                                                    })
                                                }
                                                value={state.email}
                                            />
                                        </div>
                                        <div className="col-span-6">
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                                placeholder="Password"
                                                required
                                                minLength={6}
                                                maxLength={30}
                                                onChange={(e) =>
                                                    setState({
                                                        ...state,
                                                        password: e.target.value,
                                                    })
                                                }
                                                value={state.password}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="group relative mt-6 mb-2 flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                                focus:ring-offset-2 disabled:bg-green-900 disabled:text-gray-200"
                                        disabled={state.loading}
                                    >
                                        {state.loading
                                            ? "Loading..."
                                            : "Signup"}
                                    </button>
                                </div>

                                {state.error && (
                                    <div className="px-4 py-3 text-sm uppercase text-red-600 sm:px-6">
                                        {state.error.split('"').join("")}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
