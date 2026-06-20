import { useQuery } from "@tanstack/react-query";

export function useProblem(slug: string | null) {
  return useQuery({
    queryKey: ["problem", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(`/api/problems/${slug}`);
      if (!res.ok) throw new Error("Problem not found");
      return res.json();
    },
    enabled: !!slug,
  });
}
