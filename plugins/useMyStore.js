import { useEffect, useReducer } from "react";

export const useMyStore = (id, initialState) => {
    if (!window.STORE) {
        return initialState
    }
    const [, forceRender] = useReducer((s) => s + 1, 0)
    const state = window.STORE[id] || initialState;

    useEffect(() => {
        const proxy = new Proxy(state, {
            set(target, key, value) {
                target[key] = value;
                forceRender()
                return true
            }
        })
        window.STORE[id] = proxy;
    }, [])

    let resultState = {}
    for (let key in state) {
        const value = state[key]
        if (key[0] === '$') {
            try {
                resultState[key.slice(1)] = eval(value)
            } catch {}
        } else {
            resultState[key] = value
        }
    }
    return resultState;
}