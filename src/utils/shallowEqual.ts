export default function shallowEqual(
  a: object & { [key: string]: any },
  b: object & { [key: string]: any }
) {
  for (const i in a) if (a[i] !== b[i]) return false;
  for (const i in b) if (!(i in a)) return false;
  return true;
}
