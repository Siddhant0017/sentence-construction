import { useState, useEffect } from "react";

export const useQuestionData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const jsonUrl = "https://raw.githubusercontent.com/yghugardare/Sample/refs/heads/main/sample.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(jsonUrl);
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching JSON:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};