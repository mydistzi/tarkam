import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export default function useLocalStorage<T>(keyName: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    
    const [selectedIndex, setSelectedIndex] = useState<T>(() => {

        if (typeof window === "undefined") return initialValue;

        try {
            const localStorageValue = localStorage.getItem(keyName);
            return localStorageValue ? (JSON.parse(localStorageValue) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(keyName, JSON.stringify(selectedIndex));
        }
    }, [keyName, selectedIndex]);

    return [selectedIndex, setSelectedIndex];
}