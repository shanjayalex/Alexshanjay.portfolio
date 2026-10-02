import { createContext, useContext } from "react";

// open({ kind: "video" | "short" | "image", items, index })
export const LightboxContext = createContext({ open: () => {} });

export function useLightbox() {
  return useContext(LightboxContext);
}
