import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useContext } from "react";
import axios from "../../config/axios";
import UserContext from "../../contexts/UserContext";
import { toast } from "react-hot-toast";

const defaultValues = {
    name: "",
};

const AddTodoDialog = ({ isOpen, setIsOpen }) => {
    const { todos, setTodos } = useContext(UserContext);

    const [values, setValues] = useState(defaultValues);

    const closeModal = () => {
        setIsOpen(false);
    };

    const formSubmit = (e) => {
        e.preventDefault();
        axios
            .post("/todos", {
                name: values.name,
            })
            .then((res) => {
                if (res.todo) {
                    setTodos([...todos, res.todo]);
                }
                closeModal();
            })
            .catch((err) => {
                console.log("Unable to add todo:", err);
                toast.error("Unable to add todo");
                closeModal();
            });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={closeModal}
            >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle transition-all">
                            <div className="flex justify-between">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    <span>Add a Todo</span>
                                </Dialog.Title>
                                <button
                                    className="text-gray-400 hover:text-gray-800"
                                    onClick={closeModal}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18 18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-2 h-2 w-full border-t-2 border-gray-100" />

                            <form method="POST" onSubmit={formSubmit}>
                                <div className="mt-2">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            autoComplete="devicename"
                                            className="mt-1 block w-full rounded-md border-[1px] border-gray-200 p-1 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                            minLength={1}
                                            maxLength={2048}
                                            onInput={(e) =>
                                                setValues({
                                                    ...values,
                                                    name: e.target.value,
                                                })
                                            }
                                            value={values.name}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:bg-gray-200"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddTodoDialog;
