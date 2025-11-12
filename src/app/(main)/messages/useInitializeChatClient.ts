import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useSession } from "../SessionProvider";
import kyInstance from "@/lib/ky";

export default function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    // First sync user to Stream backend, then connect
    kyInstance
      .post("/api/sync-stream-user")
      .json()
      .then(() => {
        console.log("User synced to Stream backend");

        return client.connectUser(
          {
            id: user.id,
            username: user.username,
            name: user.displayName,
            image: user.avatarUrl,
          },
          async () =>
            kyInstance
              .get("/api/get-token")
              .json<{ token: string }>()
              .then((data) => data.token),
        );
      })
      .then(() => {
        console.log("User connected to Stream Chat successfully");
        setChatClient(client);
      })
      .catch((error) => {
        console.error("Error initializing Stream Chat:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
      });

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Error disconnecting user:", error))
        .then(() => console.log("Disconnected user"));
    };
  }, [user.id, user.username, user.displayName, user.avatarUrl]);

  return chatClient;
}
