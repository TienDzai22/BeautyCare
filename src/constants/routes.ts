import type { Href } from "expo-router";

/**
 * Public Expo Router URLs never include a route file's `index` suffix.
 * Casts are isolated here because SDK 58's generated typed-route union exposes
 * nested index filenames even though the runtime URL is the index-less path.
 */
export const appRoutes = {
  dashboard: "/dashboard" as Href,
  products: "/products" as Href,
  newProduct: "/products/new" as Href,
  product: (id: string): Href => ({
    pathname: "/products/[id]" as never,
    params: { id },
  }),
  editProduct: (id: string): Href => ({
    pathname: "/products/[id]/edit" as never,
    params: { id },
  }),
};
