import { useObjectListener } from "kix";

export const localStorageState = <D extends Record<any, any>>(defaultValue: D, key: string) => {
    let state: D = JSON.parse(`${localStorage.getItem(key)}`) || defaultValue;

    useObjectListener(state, () => {
        localStorage.setItem(key, JSON.stringify(state));
    });

    return state;
}