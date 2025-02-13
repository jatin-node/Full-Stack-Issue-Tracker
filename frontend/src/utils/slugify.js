export const slugify = (title, maxLength = 50) => {
  const slug = title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove extra spaces at the beginning and end
    .replace(/[^\w\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen

  // Truncate the slug if it exceeds the maxLength
  return slug.length > maxLength ? slug.substring(0, maxLength) : slug;
};
