export async function getCategories() {
  const res = await fetch("/api/category");

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }

  return res.json();
}

export async function getCategory(id) {
  const res = await fetch(`/api/category/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch category: ${res.status}`);
  }

  return res.json();
}
