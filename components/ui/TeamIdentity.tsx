import type { MouseEvent } from "react";
import Link from "next/link";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { TeamKit, TeamKitPlaceholder } from "@/components/ui/TeamKit";
import { getTeamKit } from "@/lib/kits";
import { getTeam } from "@/lib/teams";

type TeamIdentityProps = {
  teamSlug: string | null;
  label: string;
  countryCode?: string | null;
  showFlag?: boolean;
  kitSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
  linkClassName?: string;
  onClick?: (event: MouseEvent) => void;
};

export function TeamIdentity({
  teamSlug,
  label,
  countryCode = null,
  showFlag = true,
  kitSize = "md",
  className = "",
  linkClassName = "flex min-w-0 items-center gap-2 text-cream hover:text-gold-light",
  onClick,
}: TeamIdentityProps) {
  const kit = teamSlug ? getTeamKit(teamSlug) : undefined;
  const resolvedCountryCode =
    countryCode ?? (teamSlug ? getTeam(teamSlug)?.countryCode : null);

  const kitNode = kit ? (
    <TeamKit kit={kit} size={kitSize} title={`${label} home kit`} />
  ) : teamSlug ? (
    <TeamKitPlaceholder size={kitSize} />
  ) : null;

  const content = (
    <>
      {kitNode}
      {showFlag && resolvedCountryCode ? (
        <CountryFlag countryCode={resolvedCountryCode} className="text-base" />
      ) : null}
      <span className="truncate font-medium">{label}</span>
    </>
  );

  if (teamSlug && resolvedCountryCode) {
    return (
      <Link
        href={`/teams/${teamSlug}`}
        className={`${linkClassName} ${className}`}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={`flex min-w-0 items-center gap-2 text-muted ${className}`}>
      {kitNode}
      <span className="truncate text-sm">{label}</span>
    </span>
  );
}
