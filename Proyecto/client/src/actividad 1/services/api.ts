export async function getHealth() {
  const url = import.meta.env.VITE_API_URL ?? '/api';
  const res = await fetch(`${url}/health`);
  return await res.json();
}
