import { Wc26Mark } from "@/components/brand/Wc26Mark";

type TournamentLockupProps = {
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  showMark?: boolean;
};

const sizeMap = {
  sm: { mark: 28, title: "text-lg", sub: "text-[10px]" },
  md: { mark: 40, title: "text-2xl", sub: "text-xs" },
  lg: { mark: 56, title: "text-4xl", sub: "text-sm" },
};

export function TournamentLockup({
  subtitle = "Team Base Camps",
  size = "md",
  showMark = true,
}: TournamentLockupProps) {
  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-3">
      {showMark && <Wc26Mark size={s.mark} />}
      <div>
        <p
          className={`font-display font-black uppercase leading-none tracking-[0.08em] text-cream ${s.title}`}
        >
          FIFA World Cup
          <span className="text-gold"> 26</span>
        </p>
        <p
          className={`mt-0.5 font-display font-semibold uppercase tracking-[0.25em] text-muted ${s.sub}`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
