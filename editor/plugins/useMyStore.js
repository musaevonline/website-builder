import { useEffect, useReducer } from "react";

export const useMyStore = (id, initialState) => {
    const [, forceRender] = useReducer((s) => s + 1, 0)

    useEffect(() => {
        const proxy = new Proxy(initialState, {
            set(target, key, value) {
                target[key] = value;
                forceRender()
                return true
            }
        })
        window.STORE[id] = proxy;
    }, [])

    return window.STORE[id] || initialState;
}