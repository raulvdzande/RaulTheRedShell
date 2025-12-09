import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient.jsx";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <LoginClient />;
}