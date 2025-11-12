import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    console.log("Search query received:", q);

    // Return empty if no query
    if (!q.trim()) {
      return Response.json({ posts: [], nextCursor: null });
    }

    const pageSize = 10;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use contains for all searches - more reliable and works without full-text search setup
    const searchTerm = q.trim();
    console.log("Processing search term:", searchTerm);

    const whereClause = {
      OR: [
        {
          content: {
            contains: searchTerm,
            mode: "insensitive" as const,
          },
        },
        {
          user: {
            displayName: {
              contains: searchTerm,
              mode: "insensitive" as const,
            },
          },
        },
        {
          user: {
            username: {
              contains: searchTerm,
              mode: "insensitive" as const,
            },
          },
        },
      ],
    };

    console.log(
      "Executing prisma query with where clause:",
      JSON.stringify(whereClause, null, 2),
    );

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: getPostDataInclude(user.id),
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;
    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    console.log(`Search completed successfully. Found ${posts.length} posts`);
    return Response.json(data);
  } catch (error) {
    console.error("Search error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
