import SearchField from "@/components/SearchFiled";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export default async function Navbar() {
  const { user } = await validateRequest();

  let unreadNotificationsCount = 0;
  if (user) {
    unreadNotificationsCount = await prisma?.notification?.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    });
  }

  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-5 py-3">
        {/* Desktop: Single row layout */}
        <div className="hidden items-center justify-center gap-5 sm:flex">
          <Link href="/" className="text-2xl font-bold text-primary">
            Sociofy
          </Link>
          <SearchField className="sm:w-1/3" />
          <div className="flex items-center gap-3 sm:ms-auto">
            {user && (
              <NotificationsButton
                initialState={{ unreadCount: unreadNotificationsCount }}
                compact
              />
            )}
            <UserButton className="" />
          </div>
        </div>

        {/* Mobile: Two row layout */}
        <div className="flex flex-col gap-3 sm:hidden">
          {/* First row: Logo and User buttons */}
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Sociofy
            </Link>
            <div className="flex items-center gap-3">
              {user && (
                <NotificationsButton
                  initialState={{ unreadCount: unreadNotificationsCount }}
                  compact
                />
              )}
              <UserButton className="" />
            </div>
          </div>
          {/* Second row: Search bar */}
          <SearchField className="w-full" />
        </div>
      </div>
    </header>
  );
}
