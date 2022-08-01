import React, { useState, useContext } from "react";
import moment from "moment";

import UserContext from "../../contexts/UserContext";
import axios from "../../config/axios";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
    const { user, setUser } = useContext(UserContext);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");

    const createdAtFromNow = moment(user.createdAt).fromNow();
    const updatedAtFromNow = moment(user.updatedAt).fromNow();

    const onChangePassword = (e) => {
        e.preventDefault();
        axios
            .patch("/users/@me", {
                currentPassword,
                password: newPassword,
            })
            .then((res) => {
                if (res.user) {
                    setUser(res.user);
                    toast.success("Password changed");
                }
            })
            .catch((err) => {
                console.log("Unable to change password:", err);
                if (err.code == 422) {
                    toast.error(err.message);
                } else {
                    toast.error("Unable to change password");
                }
            })
            .finally(() => {
                setCurrentPassword("");
                setNewPassword("");
            });
    };

    const onChangeUsername = (e) => {
        e.preventDefault();
        axios
            .patch("/users/@me", {
                currentPassword,
                username: newUsername,
            })
            .then((res) => {
                if (res.user) {
                    setUser(res.user);
                    toast.success("Username changed");
                }
            })
            .catch((err) => {
                console.log("Unable to change username:", err);
                if (err.code == 422) {
                    toast.error(err.message);
                } else {
                    toast.error("Unable to change username");
                }
            })
            .finally(() => {
                setCurrentPassword("");
                setNewUsername("");
            });
    };

    return (
        <div className="flex-1 bg-neutral-50">
            {/* Max width wrapper */}
            <div className="mx-auto min-h-[30rem] w-full max-w-7xl px-2 pb-8 pt-4 sm:px-4">
                <main className="w-full space-y-4">
                    <div className="overflow-hidden rounded-lg bg-gradient-to-l from-green-200 via-white to-white shadow">
                        <div className="flex items-center justify-between px-4 py-5 sm:p-6">
                            <h1 className="text-4xl font-bold">Your Profile</h1>
                        </div>
                    </div>

                    <section className="bg-white px-4 py-5 shadow sm:p-6 lg:flex-row lg:space-y-2 lg:space-x-4">
                        <div className="flex w-full flex-col">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Information
                                </h2>
                            </div>

                            <div className="mt-4 flex flex-col gap-5 font-medium">
                                <p className="text-gray-600">
                                    <span className="font-semibold">
                                        Username:
                                    </span>{" "}
                                    {user.username}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">
                                        Email:
                                    </span>{" "}
                                    {user.email}
                                </p>
                                <div className="flex gap-2 text-xs font-normal text-gray-500">
                                    <p>Created {createdAtFromNow}</p>
                                    <p>•</p>
                                    <p>Updated {updatedAtFromNow}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Change username section */}
                    <section className="bg-white px-4 py-5 shadow sm:p-6 lg:flex-row lg:space-y-2 lg:space-x-4">
                        <div className="flex w-full flex-col">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Change Username
                                </h2>
                            </div>

                            <form
                                method="POST"
                                className="space-y-2"
                                onSubmit={onChangeUsername}
                            >
                                <div className="mt-4">
                                    <label
                                        htmlFor="password1"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password1"
                                        required
                                        autoComplete="password"
                                        className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                        minLength={6}
                                        maxLength={30}
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="mt-4">
                                    <label
                                        htmlFor="new_username"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        New Username
                                    </label>
                                    <input
                                        type="text"
                                        name="new_username"
                                        required
                                        autoComplete="text"
                                        className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                        minLength={3}
                                        maxLength={50}
                                        value={newUsername}
                                        onChange={(e) =>
                                            setNewUsername(e.target.value)
                                        }
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:bg-gray-200"
                                >
                                    Change Username
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Change password section */}
                    <section className="bg-white px-4 py-5 shadow sm:p-6 lg:flex-row lg:space-y-2 lg:space-x-4">
                        <div className="flex w-full flex-col">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Change Password
                                </h2>
                            </div>

                            <form
                                method="POST"
                                className="space-y-2"
                                onSubmit={onChangePassword}
                            >
                                <div className="mt-4">
                                    <label
                                        htmlFor="password2"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password2"
                                        required
                                        autoComplete="password"
                                        className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                        minLength={6}
                                        maxLength={30}
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="mt-4">
                                    <label
                                        htmlFor="new_password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="new_password"
                                        required
                                        autoComplete="password"
                                        className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                        minLength={6}
                                        maxLength={30}
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:bg-gray-200"
                                >
                                    Change Password
                                </button>
                            </form>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
