import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterClient from "./RegisterClient";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  // Als user al ingelogd is → direct naar home
  if (user) {
    redirect("/");
  }

  return <RegisterClient />;
}