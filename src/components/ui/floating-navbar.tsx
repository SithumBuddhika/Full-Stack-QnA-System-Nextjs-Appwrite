"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  name: string;
  link: string;
  icon?: React.ReactNode;
};

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  const { session, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  React.useEffect(() => {
    const isScrollable = (el: Element) => {
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      return (
        (overflowY === "auto" ||
          overflowY === "scroll" ||
          overflowY === "overlay") &&
        el.scrollHeight > el.clientHeight
      );
    };

    const scrollableElements = Array.from(
      document.querySelectorAll("*"),
    ).filter((el) => isScrollable(el)) as HTMLElement[];

    const getCurrentScrollTop = () => {
      const windowTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const elementTop = scrollableElements.reduce(
        (max, el) => Math.max(max, el.scrollTop || 0),
        0,
      );
      return Math.max(windowTop, elementTop);
    };

    const handleScroll = () => {
      const currentScrollY = getCurrentScrollTop();

      if (currentScrollY <= 20) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    scrollableElements.forEach((el) =>
      el.addEventListener("scroll", handleScroll, { passive: true }),
    );

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      scrollableElements.forEach((el) =>
        el.removeEventListener("scroll", handleScroll),
      );
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-6 z-50 mx-auto flex max-w-fit items-center justify-center gap-2 rounded-full",
        "border border-white/10 bg-white/90 px-2 py-2 shadow-[0px_12px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md",
        "transition-all duration-300 ease-in-out",
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-28 opacity-0 pointer-events-none",
        className,
      )}
    >
      {navItems.map((navItem) => {
        const active = isActive(navItem.link);

        return (
          <Link
            key={navItem.link}
            href={navItem.link}
            className={cn(
              "group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
              "active:scale-[0.98]",
              active
                ? "bg-black text-white shadow-sm"
                : "text-black/70 hover:bg-black/10 hover:text-black",
            )}
          >
            <span
              className={cn(
                "block sm:hidden transition",
                active ? "text-white" : "text-black/60 group-hover:text-black",
              )}
            >
              {navItem.icon}
            </span>

            <span className="hidden sm:block">{navItem.name}</span>

            {active && (
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2">
                <span
                  className={cn(
                    "block h-1.5 w-1.5 rounded-full",
                    "bg-gradient-to-r from-[#ffd319] via-[#ff2975] to-[#8c1eff]",
                    "shadow-[0_0_0_3px_rgba(255,41,117,0.18),0_0_18px_rgba(140,30,255,0.55)]",
                  )}
                />
              </span>
            )}
          </Link>
        );
      })}

      {session ? (
        <button
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className={cn(
            "ml-1 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
            "border border-black/10 bg-white text-black/80",
            "hover:bg-red-500 hover:text-white",
            "active:scale-[0.98]",
          )}
          type="button"
        >
          Logout
        </button>
      ) : (
        <>
          <Link
            href="/login"
            className={cn(
              "ml-1 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
              "border border-black/10 bg-white text-black/80",
              "hover:bg-black hover:text-white",
              "active:scale-[0.98]",
            )}
          >
            Login
          </Link>

          <Link
            href="/register"
            className={cn(
              "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
              "bg-black text-white",
              "hover:opacity-90",
              "active:scale-[0.98]",
            )}
          >
            Signup
          </Link>
        </>
      )}
    </div>
  );
};
