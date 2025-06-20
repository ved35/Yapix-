import { ROUTE } from "@/config/routes";

export function routeWithoutSegment(name: keyof typeof ROUTE) {
  const pathname = ROUTE[name] as string;

  return pathname.replace(/[\\/]\(.*?\)/, "");
}
