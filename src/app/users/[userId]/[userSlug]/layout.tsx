// src/app/users/[userId]/[userSlug]/layout.tsx
import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Particles from "@/components/ui/particles";

import { avatars } from "@/models/client/config";
import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string; userSlug: string }>;
}) {
  const { userId } = await params;
  const user = await users.get<UserPrefs>(userId);

  const avatarSrc = String(avatars.getInitials(user.name, 200, 200));

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden bg-black text-white">
      {/* background */}
      <Particles
        className="fixed inset-0 -z-10 h-full w-full"
        quantity={500}
        ease={80}
        color="#ffffff"
        refresh
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(140,30,255,0.22),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,211,25,0.18),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,41,117,0.18),transparent_45%)]" />

      <Header />

      <div className="container mx-auto space-y-4 px-4 pb-20 pt-32">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-40 shrink-0">
            <picture className="block w-full">
              <img
                src={avatarSrc}
                alt={user.name}
                className="h-full w-full rounded-xl object-cover"
              />
            </picture>
          </div>

          <div className="w-full">
            <div className="flex items-start justify-between gap-6">
              <div className="block space-y-1">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-lg text-white/60">{user.email}</p>

                <p className="flex items-center gap-1 text-sm font-semibold text-white/60">
                  <IconUserFilled className="w-4 shrink-0" />
                  Dropped {convertDateToRelativeTime(new Date(user.$createdAt))}
                </p>

                <p className="flex items-center gap-1 text-sm text-white/60">
                  <IconClockFilled className="w-4 shrink-0" />
                  Last activity{" "}
                  {convertDateToRelativeTime(new Date(user.$updatedAt))}
                </p>
              </div>

              <div className="shrink-0">
                <EditButton />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Navbar />
          <div className="w-full">{children}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
