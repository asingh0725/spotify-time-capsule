export function buildRecommendationsUrl(
  artists: string[],
  genres: string[],
  tracks: string[]
): string {
  return (
    "https://api.spotify.com/v1/recommendations?" +
    `seed_artists=${artists.slice(0, 1).join(",")}` +
    `&seed_genres=${genres.join(",")}` +
    `&seed_tracks=${tracks[0] ?? ""}` +
    "&limit=20"
  );
}
