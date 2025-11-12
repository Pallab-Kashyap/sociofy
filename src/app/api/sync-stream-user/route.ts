import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";

export async function POST() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Syncing user to Stream Chat:", user.id);

    // Upsert user to Stream Chat
    await streamServerClient.upsertUser({
      id: user.id,
      username: user.username,
      name: user.displayName,
      image: user.avatarUrl || undefined,
    });

    console.log("User synced successfully to Stream Chat");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error syncing user to Stream Chat:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
