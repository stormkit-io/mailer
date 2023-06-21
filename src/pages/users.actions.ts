import { useEffect, useState } from "react";

interface FetchUsersProps {
  refreshToken?: number;
}

export function useFetchUsers({ refreshToken }: FetchUsersProps = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetch("/api/subscribers")
      .then(async (res) => {
        const data = (await res.json()) as { users: User[] };
        setUsers(data.users);
      })
      .catch(async (e) => {
        if (e instanceof Error) {
          setError(e.message);
        } else if (e instanceof Response) {
          const data = (await e.json()) || {};
          setError(data.error || data.errors || data);
        } else {
          console.error(e);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refreshToken]);

  return { users, isLoading, error };
}

interface DeleteUserProps {
  recordId: string;
}

export function deleteUser({ recordId }: DeleteUserProps) {
  return fetch("/api/subscriber", {
    method: "DELETE",
    body: JSON.stringify({ recordIds: [recordId] }),
  }).then(async (res) => {
    return await res.json();
  });
}
