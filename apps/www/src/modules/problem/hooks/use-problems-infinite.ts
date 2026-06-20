import { useEffect, useMemo, useRef } from "react";

import type { GetApiProblems200, GetApiProblemsQueryParams } from "@repo/kubb";
import { getApiProblems } from "@repo/kubb";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useIntersectionObserver } from "@/shared/hooks/use-intersection-observer";

const LIMIT = 10;

export function useProblemsInfinite(difficulty?: string, search?: string) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["problems", difficulty ?? "", search ?? ""],
      queryFn: async ({ pageParam }) => {
        const params: GetApiProblemsQueryParams = { limit: LIMIT };
        if (pageParam) params.cursor = pageParam;
        if (difficulty)
          params.difficulty = difficulty as NonNullable<
            GetApiProblemsQueryParams["difficulty"]
          >;
        if (search) params.search = search;
        const res = await getApiProblems(params);
        return res as GetApiProblems200;
      },
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0,
    rootMargin: "200px",
  });

  const prevWasFetching = useRef(isFetchingNextPage);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (
      prevWasFetching.current &&
      !isFetchingNextPage &&
      hasNextPage &&
      isIntersecting
    ) {
      fetchNextPage();
    }
    prevWasFetching.current = isFetchingNextPage;
  }, [isFetchingNextPage, hasNextPage, isIntersecting, fetchNextPage]);

  const problems = useMemo(() => {
    const seen = new Set<string>();
    return (
      data?.pages
        .flatMap((page) => page.data)
        .filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        }) ?? []
    );
  }, [data]);

  return {
    problems,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    sentinelRef: ref,
  };
}
