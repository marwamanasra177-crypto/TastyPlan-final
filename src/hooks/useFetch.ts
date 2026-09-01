import { useEffect, useState } from "react";
import axios from "axios";

function useFetch<T>(url: string) {

    const [data, setData] =
        useState<T | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);
                setError(null);

                const response =
                    await axios.get<T>(url);

                setData(response.data);

            } catch (error) {

                if (axios.isAxiosError(error)) {

                    setError(
                        error.response?.data?.message ||
                        error.message ||
                        "Something went wrong"
                    );

                } else {

                    setError(
                        "Something went wrong"
                    );

                }

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, [url]);

    return {
        data,
        loading,
        error
    };
}

export default useFetch;