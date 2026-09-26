import { createContext, useContext } from "react";
import type { Member } from "./permissions";

/**
 * What every admin screen needs to know about the session and the database.
 *
 * `editable` is false in preview — before the database is connected or
 * before the owner has imported the site's content — when every screen can
 * be opened and read but nothing can be saved.
 */
export type AdminContextValue = {
  configured: boolean;
  serviceKey: boolean;
  imported: boolean;
  member: Member | null;
  editable: boolean;
  uploads: boolean;
};

export const AdminContext = createContext<AdminContextValue>({
  configured: false,
  serviceKey: false,
  imported: false,
  member: null,
  editable: false,
  uploads: false,
});

export const useAdmin = () => useContext(AdminContext);
