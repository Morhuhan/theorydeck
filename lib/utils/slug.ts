export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function generateUniqueSlug(
  title: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = generateSlug(title);
  let counter = 1;
  
  while (await checkExists(slug)) {
    slug = `${generateSlug(title)}-${counter}`;
    counter++;
  }
  
  return slug;
}