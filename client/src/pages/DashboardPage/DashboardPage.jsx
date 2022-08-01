import { useState, useContext } from "react";

import UserContext from "../../contexts/UserContext";
import TodoItem from "./../../components/Todo/TodoItem";
import AddTodoDialog from "../../components/Todo/AddTodoDialog";

const DashboardPage = () => {
    const { user, todos } = useContext(UserContext);
    const [addTodoOpen, setAddTodoOpen] = useState(false);

    return (
        <div className="flex-1 bg-neutral-50">
            <AddTodoDialog
                isOpen={addTodoOpen}
                setIsOpen={setAddTodoOpen}
                setShowSuccesDialog={() => {}}
            />
            {/* Max width wrapper */}
            <div className="mx-auto min-h-[30rem] w-full max-w-7xl px-2 pb-8 pt-4 sm:px-4">
                <main className="w-full space-y-4">
                    {/* Hello section */}
                    <div className="overflow-hidden rounded-lg bg-gradient-to-l from-green-200 via-white to-white shadow">
                        <div className="flex items-center justify-between px-4 py-5 sm:p-6">
                            <h1 className="text-4xl font-bold">
                                Hello, {user.username}.
                            </h1>
                        </div>
                    </div>

                    {/* Todos section */}
                    <section className="bg-white px-4 py-5 shadow sm:p-6 lg:flex-row lg:space-y-2 lg:space-x-4">
                        <div className="flex w-full flex-col">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Your Todos
                                </h2>
                                <button
                                    className="h-8 w-32 rounded border border-transparent bg-green-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={() => setAddTodoOpen(true)}
                                >
                                    Add Todo
                                </button>
                            </div>

                            <div className="mt-4 flex flex-col gap-5">
                                {/* Todo item */}
                                {todos.length == 0 && (
                                    <p className="text-gray-600">No todos</p>
                                )}
                                {todos.map((todo) => {
                                    return (
                                        <TodoItem todo={todo} key={todo._id} />
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
