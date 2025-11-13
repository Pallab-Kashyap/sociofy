import { StreamChat } from "stream-chat";

console.log("Initializing Stream Chat with:", {
  key: process.env.NEXT_PUBLIC_STREAM_KEY,
  hasSecret: !!process.env.STREAM_SECRET,
});

const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!,
  process.env.STREAM_SECRET!,
);

export default streamServerClient;
