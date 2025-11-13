"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import kyInstance from "@/lib/ky";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";
import { UserData } from "@/lib/types";

interface UserFollowersProps {
  userId: string;
}

interface FollowersPage {
  followers: UserData[];
  nextCursor: string | null;
}

export default function UserFollowers({ userId }: UserFollowersProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["followers", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/followers/list`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<FollowersPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const followers = data?.pages.flatMap((page) => page.followers) || [];

  if (status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (status === "success" && !followers.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">No followers yet.</p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading followers.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {followers.map((follower) => (
        <div
          key={follower.id}
          className="flex items-center justify-between gap-3"
        >
          <Link
            href={`/users/${follower.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={follower.avatarUrl} size={40} />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {follower.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{follower.username}
              </p>
            </div>
          </Link>
          <FollowButton
            userId={follower.id}
            initialState={{
              followers: follower._count.followers,
              isFollowedByUser: follower.followers.length > 0,
            }}
          />
        </div>
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
    </InfiniteScrollContainer>
  );
}
