import { createFileRoute } from "@tanstack/react-router";
import { AccountScreen } from "@/admin/screens/Account";

export const Route = createFileRoute("/admin/account")({
  head: () => ({ meta: [{ title: "My Account — Durall Admin" }] }),
  component: AccountScreen,
});
