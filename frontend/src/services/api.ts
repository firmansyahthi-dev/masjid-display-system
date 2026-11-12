
const API_BASE_URL = "/api";

export async function checkApiHealth() {
  const response = await fetch(
    `${API_BASE_URL}/health`
  );

  if (!response.ok) {
    throw new Error("Backend API tidak dapat diakses");
  }

  return response.json();
}
