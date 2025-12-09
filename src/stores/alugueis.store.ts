import { useCallback, useState } from "react";
import { User } from "../../types/user";
import { UsersService } from "../services/users.service";

export const useUsersStore = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UsersService.getAll();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, loading, fetchUsers };
};