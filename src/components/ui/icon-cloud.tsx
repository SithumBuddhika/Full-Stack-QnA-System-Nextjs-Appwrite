"use client";

import React, { memo, useMemo } from "react";
import { cn } from "@/lib/utils";

import { Cloud, renderSimpleIcon } from "react-icon-cloud";
import * as simpleIcons from "simple-icons";

export type IconCloudProps = {
  iconSlugs: string[];
  className?: string;
};

function toSiKey(slug: string) {
  // "nextdotjs" -> "siNextdotjs"
  // "visualstudiocode" -> "siVisualstudiocode"
  // also handle "-" and "." and "+"
  const cleaned = slug
    .replace(/\./g, "")
    .replace(/\+/g, "Plus")
    .replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());
  return `si${cleaned}`;
}

function resolveIcon(slug: string) {
  const lib: any = simpleIcons as any;

  // Some versions expose: simpleIcons.icons["javascript"]
  if (lib?.icons?.[slug]) return lib.icons[slug];

  // Some versions expose: simpleIcons.siJavascript, etc.
  const key = toSiKey(slug);
  if (lib?.[key]) return lib[key];

  return null;
}

export const IconCloud = memo(function IconCloud({
  iconSlugs,
  className,
}: IconCloudProps) {
  const renderedIcons = useMemo(() => {
    return iconSlugs
      .map((slug) => {
        const icon = resolveIcon(slug);
        if (!icon) return null;

        return renderSimpleIcon({
          icon,
          size: 72,
          aProps: {
            href: "#",
            onClick: (e: any) => e.preventDefault(),
          },
        });
      })
      .filter(Boolean);
  }, [iconSlugs]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Cloud
        options={{
          wheelZoom: false,
          depth: 0.9,
          initial: [0.1, -0.1],
          reverse: true,
          maxSpeed: 0.05,
          minSpeed: 0.03,
        }}
      >
        {renderedIcons as any}
      </Cloud>
    </div>
  );
});
