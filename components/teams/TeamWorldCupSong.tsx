import {
  formatWorldCupSongLabel,
  getSpotifySearchUrl,
  getTeamWorldCupSongs,
  getYouTubeSearchUrl,
  type WorldCupStadiumSong,
} from "@/lib/world-cup/songs";

type TeamWorldCupSongProps = {
  teamSlug: string;
  teamName: string;
};

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  );
}

function SongRow({
  label,
  song,
  teamName,
}: {
  label: string;
  song: WorldCupStadiumSong;
  teamName: string;
}) {
  const songLabel = formatWorldCupSongLabel(song);

  return (
    <div>
      <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <p className="mt-1 text-lg text-cream">{songLabel}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={getSpotifySearchUrl(song)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[#1db954]/40 bg-[#1db954]/10 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-[#1ed760] transition hover:border-[#1db954]/70 hover:bg-[#1db954]/15 interaction-press ui-focus-ring"
          data-haptic="light"
        >
          Spotify
        </a>
        <a
          href={getYouTubeSearchUrl(song)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-red-300 transition hover:border-red-500/50 hover:bg-red-500/15 interaction-press ui-focus-ring"
          data-haptic="light"
        >
          YouTube
        </a>
      </div>
      <p className="sr-only">
        Listen to {teamName}&apos;s {label.toLowerCase()}, {songLabel}
      </p>
    </div>
  );
}

export function TeamWorldCupSong({ teamSlug, teamName }: TeamWorldCupSongProps) {
  const songs = getTeamWorldCupSongs(teamSlug);
  if (!songs) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2">
        <MusicNoteIcon className="h-4 w-4 text-gold" />
        <h2 className="font-display text-xl font-black uppercase tracking-[0.08em] text-cream">
          Stadium Soundtrack
        </h2>
      </div>
      <p className="mt-2 text-sm text-muted">
        FIFA invited each federation to submit songs played in stadiums when{" "}
        {teamName} scores and after a win.
      </p>
      <div className="mt-4 space-y-6 wc26-panel p-6">
        <SongRow label="Goal celebration" song={songs.goalSong} teamName={teamName} />
        {songs.victorySong && (
          <SongRow label="Victory" song={songs.victorySong} teamName={teamName} />
        )}
      </div>
    </section>
  );
}
