import { createContext } from "react";

export default createContext({
    user: null,
    todos: [],
    setUser: () => {},
    setTodos: () => {},
});
