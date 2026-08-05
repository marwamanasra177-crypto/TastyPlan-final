import { useEffect, useState } from "react";

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    if (!url) return;
    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;