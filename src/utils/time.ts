export function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
}
  
export function formatDateLabel(ts: number): string {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  
    if (sameDay(d, today)) return 'Сегодня';
    if (sameDay(d, yesterday)) return 'Вчера';
  
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}
  
export function groupByDate<T extends { timestamp: number }>(
    items: T[]
): Array<{ label: string; items: T[] }> {
    const groups: Array<{ label: string; items: T[] }> = [];
  
    for (const item of items) {
      const label = formatDateLabel(item.timestamp);
      const last = groups[groups.length - 1];
      if (last && last.label === label) {
        last.items.push(item);
      } else {
        groups.push({ label, items: [item] });
      }
    }
  
    return groups;
}