import { create } from "zustand";
import { UsersService } from "./services/users.service";

export const useUsersStore = create((set) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    const users = await UsersService.getAll();
    set({ users, loading: false });
  },
}));