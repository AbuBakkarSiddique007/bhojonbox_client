export function providerTitle(storeName?: string, address?: string | null, ownerName?: string | null) {
  const s = storeName?.trim();
  const o = ownerName?.trim();
  const a = address?.trim();

  if (s && s.length > 0) return s;
  if (o && o.length > 0) return o;
  if (a && a.length > 0) return a;
  return 'Provider';
}

export default providerTitle;
