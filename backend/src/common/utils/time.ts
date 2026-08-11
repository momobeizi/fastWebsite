
/**
 * 格式化时间（yyyy-MM-dd HH:mm:ss）
 * @param date 需要格式化的时间
 * @returns string 格式化后的时间字符串
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const d = new Date(date);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}