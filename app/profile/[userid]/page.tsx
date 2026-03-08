import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user/user-actions";
import ProfileForm from "../components/profile-form";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userid: string }>;
}) {
  const { userid } = await params;

  const user = await getUserById(userid);

  if (!user) {
    redirect("/login");
  }

  return <ProfileForm user={user} />;
}
