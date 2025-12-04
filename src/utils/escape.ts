export function escapeHTML(str: string): string {
  return str.replace(/[&<>'"]/g, (tag) => {
    const chars: any = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return chars[tag] || tag;
  });
}
