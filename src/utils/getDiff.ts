import { shallowEqual } from "./shallowEqual";

type ObjLike = Record<string, unknown>;
function differs(a: unknown, b: unknown): boolean {
  if (a !== b) {
    return true;
  } else if (a && typeof a === "object" && b && typeof b === "object") {
    return !shallowEqual(a as ObjLike, b as ObjLike);
  }
  return false;
}

export default function getDiff(
  newData: ObjLike,
  oldData: ObjLike
): { diff: ObjLike; changed: boolean } {
  const diff: ObjLike = {};
  let changed = false;
  for (const key in newData) {
    const val = newData[key];
    if (differs(oldData[key], val)) {
      changed = true;
      if (typeof val === "object" && typeof val["getMonth"] !== "function") {
        diff[key] = Array.isArray(val) ? val.slice(0) : { ...val };
      } else {
        diff[key] = val;
      }
    }
  }
  return { diff, changed };
}
