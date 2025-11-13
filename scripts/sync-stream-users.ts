import { PrismaClient } from "@prisma/client";
import { StreamChat } from "stream-chat";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Starting Stream Chat user sync...");

  const streamKey = process.env.NEXT_PUBLIC_STREAM_KEY;
  const streamSecret = process.env.STREAM_SECRET;

  if (!streamKey || !streamSecret) {
    throw new Error("Missing Stream Chat credentials");
  }

  const streamClient = StreamChat.getInstance(streamKey, streamSecret);

  // Get all users from database
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  });

  console.log(`📊 Found ${users.length} users to sync`);

  // Sync users to Stream Chat in batches
  const batchSize = 100;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);

    await streamClient.upsertUsers(
      batch.map((user) => ({
        id: user.id,
        username: user.username,
        name: user.displayName,
        image: user.avatarUrl || undefined,
      })),
    );

    console.log(
      `✅ Synced batch ${Math.floor(i / batchSize) + 1} (${Math.min(i + batchSize, users.length)}/${users.length} users)`,
    );
  }

  console.log("🎉 Stream Chat user sync completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during sync:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
