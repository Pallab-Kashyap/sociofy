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
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
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
    </header>
  );
}
