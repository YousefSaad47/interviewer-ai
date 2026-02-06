"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export const useIsMounted = () => {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
};
