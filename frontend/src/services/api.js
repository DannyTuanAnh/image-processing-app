const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Upload an image file to the backend.
 * Sends multipart/form-data with field name "image" (matches backend controller).
 * @param {File} file
 * @returns {Promise<Object>} parsed JSON response from the server
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/files/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Upload failed with status ${res.status}`);
  }

  return res.json();
}

export default { uploadImage };
