import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const follows = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
        follower: {
          select: getUserDataSelect(loggedInUser.id),
        },
      },
      take: pageSize + 1,
      cursor: cursor
        ? {
            followerId_followingId: { followerId: cursor, followingId: userId },
          }
        : undefined,
    });

    const nextCursor =
      follows.length > pageSize ? follows[pageSize].followerId : null;

    const data = {
      followers: follows.slice(0, pageSize).map((follow) => follow.follower),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
