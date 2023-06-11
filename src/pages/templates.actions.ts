import { useEffect, useState } from "react";

export function useFetchTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetch("/api/templates")
      .then(async (res) => {
        const data = (await res.json()) as { templates: Template[] };
        setTemplates(data.templates);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { templates, isLoading, error };
}
