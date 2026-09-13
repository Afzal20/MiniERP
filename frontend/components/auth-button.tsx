import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function AuthButton() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("bp_access_token")?.value ||
    cookieStore.get("bp_refresh_token")?.value;

  if (token) {
    return redirect("/dashboard");
  }

  return null;
}
