import songsData from "@/data/team-world-cup-songs.json";

export type WorldCupStadiumSong = {
  title: string;
  artist: string;
};

export type TeamWorldCupSongs = {
  teamSlug: string;
  goalSong: WorldCupStadiumSong;
  victorySong?: WorldCupStadiumSong;
};

const songs = songsData as TeamWorldCupSongs[];
const songsBySlug = new Map(songs.map((entry) => [entry.teamSlug, entry]));

export function getTeamWorldCupSongs(
  teamSlug: string,
): TeamWorldCupSongs | undefined {
  return songsBySlug.get(teamSlug);
}

export function formatWorldCupSongLabel(song: WorldCupStadiumSong): string {
  return `${song.title} — ${song.artist}`;
}

export function getSpotifySearchUrl(song: WorldCupStadiumSong): string {
  const query = `${song.title} ${song.artist}`;
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
}

export function getYouTubeSearchUrl(song: WorldCupStadiumSong): string {
  const query = `${song.title} ${song.artist} official audio`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
