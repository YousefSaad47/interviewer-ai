import { redirect } from "next/navigation";

export default function ProfilePage() {
  // Redirect to settings profile page
  redirect("/settings/profile");
}
