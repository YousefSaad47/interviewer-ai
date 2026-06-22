export const getAuthCallbackUrl = (path: string) => {
  return `${window.location.origin}${path}`;
};
