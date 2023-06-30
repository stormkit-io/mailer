import { useEffect, useState } from "react";
import { fetcher } from "~/utils";

interface FetchTemplatesProps {
  refreshToken?: number;
}

export function useFetchTemplates({ refreshToken }: FetchTemplatesProps = {}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetcher("/api/templates")
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
  }, [refreshToken]);

  return { templates, isLoading, error };
}

interface DeleteTemplateProps {
  recordId: string;
}

export function deleteTemplate({ recordId }: DeleteTemplateProps) {
  return fetcher("/api/template", {
    method: "DELETE",
    body: { recordId },
  }).then(async (res) => {
    return await res.json();
  });
}
