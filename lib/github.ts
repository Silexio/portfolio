const REPO_PATTERN = /github\.com\/([^/]+\/[^/]+)/;
const REVALIDATE_SECONDS = 86400;

export type RepoStats = {
  stars: number;
};

/** Fetches public repo stats at build time; failures degrade to no stats. */
export async function fetchRepoStats(urls: string[]): Promise<Record<string, RepoStats>> {
  const repos = [...new Set(urls.map((url) => url.match(REPO_PATTERN)?.[1]).filter(Boolean))];
  const entries = await Promise.all(
    repos.map(async (repo) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: REVALIDATE_SECONDS },
        });
        if (!res.ok) return null;
        const data: { stargazers_count: number } = await res.json();
        return [repo, { stars: data.stargazers_count }] as const;
      } catch {
        return null;
      }
    }),
  );
  return Object.fromEntries(entries.filter((entry) => entry !== null));
}

export function repoFromUrl(url: string) {
  return url.match(REPO_PATTERN)?.[1];
}
