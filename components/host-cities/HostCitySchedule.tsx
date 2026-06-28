import { SectionHeading } from "@/components/brand/SectionHeading";
import { CityMatchScheduleRow } from "@/components/host-cities/CityMatchScheduleRow";
import { getHostCitySchedule } from "@/lib/schedule";
import type { HostCity } from "@/lib/types";

type HostCityScheduleProps = {
  city: HostCity;
};

export function HostCitySchedule({ city }: HostCityScheduleProps) {
  const schedule = getHostCitySchedule(city.slug);
  const groupMatches = schedule.filter((match) => match.stage === "group");
  const knockoutMatches = schedule.filter((match) => match.stage !== "group");

  if (schedule.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <SectionHeading
        title="Match Schedule"
        subtitle={`${schedule.length} fixtures at ${city.stadium} · tap finished matches for highlights`}
      />

      {groupMatches.length > 0 && (
        <div className="mt-4 wc26-panel overflow-hidden">
          <div className="border-b border-card-border bg-card/80 px-4 py-2">
            <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted">
              Group stage · {groupMatches.length}{" "}
              {groupMatches.length === 1 ? "match" : "matches"}
            </p>
          </div>
          {groupMatches.map((match) => (
            <CityMatchScheduleRow key={match.matchNumber} match={match} />
          ))}
        </div>
      )}

      {knockoutMatches.length > 0 && (
        <div className="mt-4 wc26-panel overflow-hidden">
          <div className="border-b border-card-border bg-card/80 px-4 py-2">
            <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-muted">
              Knockout rounds · {knockoutMatches.length}{" "}
              {knockoutMatches.length === 1 ? "match" : "matches"}
            </p>
          </div>
          {knockoutMatches.map((match) => (
            <CityMatchScheduleRow key={match.matchNumber} match={match} />
          ))}
          <p className="border-t border-card-border px-4 py-2 text-xs text-muted">
            Embedded highlights load from Highlightly when configured. A FIFA.com
            link is always available as a fallback.
          </p>
        </div>
      )}
    </section>
  );
}
