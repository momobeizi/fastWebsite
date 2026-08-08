export function arrayToTree<T extends Record<string, any>>(
  originArray: T[],
  idKey: string,
  parentIdKey: string,
  childrenKey: string
): T[] {
  const map = new Map<string | number, Record<string, any>>();
  const tree: Record<string, any>[] = [];

  for (const item of originArray) {
    map.set(item[idKey], { ...item });
  }

  for (const item of map.values()) {
    const parentId = item[parentIdKey];
    const parentNode = map.get(parentId);
    if (parentNode) {
      if (!parentNode[childrenKey]) {
        parentNode[childrenKey] = [];
      }
      parentNode[childrenKey].push(item);
    } else {
      tree.push(item);
    }
  }
  return tree as T[];
}