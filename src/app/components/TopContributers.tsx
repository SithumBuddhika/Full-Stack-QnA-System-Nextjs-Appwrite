import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { users } from "@/models/server/config";
import { Models, Query } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { avatars } from "@/models/client/config";

const Notification = ({ user }: { user: Models.User<UserPrefs> }) => {
  const avatarSrc = avatars.getInitials(user.name, 40, 40) as unknown as string;

  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white/5 dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <picture>
          <img src={avatarSrc} alt={user.name} className="rounded-2xl" />
        </picture>

        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-white">
            <span className="text-sm sm:text-lg">{user.name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-400">
              {convertDateToRelativeTime(new Date(user.$updatedAt))}
            </span>
          </figcaption>

          <p className="text-sm font-normal text-white/60">
            <span>Reputation</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-400">
              {user.prefs?.reputation ?? 0}
            </span>
          </p>
        </div>
      </div>
    </figure>
  );
};

export default async function TopContributers() {
  const topUsers = await users.list<UserPrefs>([Query.limit(10)]);

  return (
    <div className="relative flex max-h-[400px] min-h-[400px] w-full max-w-[32rem] flex-col overflow-hidden rounded-lg bg-white/10 p-6 shadow-lg">
      <AnimatedList>
        {topUsers.users.map((user) => (
          <Notification user={user} key={user.$id} />
        ))}
      </AnimatedList>
    </div>
  );
}
