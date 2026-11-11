import { useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";

export function useProduct(routeId: string | string[] | undefined) {
  const { products, loading, error } = useProducts();
  const id = Array.isArray(routeId) ? routeId[0] : routeId;
  const product = useMemo(() => products.find((item) => item.id === id), [id, products]);
  return { id, product, loading, error, notFound: !loading && !error && Boolean(id) && !product, invalidId: !loading && !error && !id };
}
