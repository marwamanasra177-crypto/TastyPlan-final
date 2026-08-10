import { useEffect, useState } from "react";

function useLocalStorage<T>(
    key: string,
    initialValue: T
) {
    const [value, setValue] = useState<T>(() => {

        const storedValue =
            localStorage.getItem(key);

        if (storedValue !== null) {
            try {
                return JSON.parse(storedValue);
            } catch {
                return initialValue;
            }
        }

        return initialValue;
    });

    useEffect(() => {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }, [key, value]);

    return [value, setValue] as const;
}

export default useLocalStorage;