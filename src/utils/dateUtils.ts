export type Season = "Spring" | "Summer" | "Fall" | "Winter";

interface SeasonRange {
  start: string;
  end: string;
}

type SeasonMap = Map<number, Record<Season, SeasonRange>>;

export function buildSeasonMap(years: number[]): SeasonMap {
  const map: SeasonMap = new Map();

  years.forEach((year) => {
    map.set(year, {
      Winter: {
        start: `${year}-12-21T00:00:00Z`,
        end: `${year + 1}-03-19T00:00:00Z`,
      },
      Spring: {
        start: `${year}-03-20T00:00:00Z`,
        end: `${year}-06-20T00:00:00Z`,
      },
      Summer: {
        start: `${year}-06-21T00:00:00Z`,
        end: `${year}-09-21T00:00:00Z`,
      },
      Fall: {
        start: `${year}-09-22T00:00:00Z`,
        end: `${year}-12-20T00:00:00Z`,
      },
    });
  });

  return map;
}

export function getSeasonRange(
  seasonMap: SeasonMap,
  year: number,
  season: Season
): SeasonRange | null {
  return seasonMap.get(year)?.[season] ?? null;
}
