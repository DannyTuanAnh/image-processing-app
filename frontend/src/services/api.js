const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8090/upload";

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

/**
 * Fetch all uploaded images from the backend.
 * @returns {Promise<Array>} array of file response objects
 */
export async function getAllImages() {
  const res = await fetch(`${API_BASE}/files`);
  if (!res.ok) {
    throw new Error(`Failed to fetch images with status ${res.status}`);
  }
  return res.json();
}

/**
 * Delete an image by ID.
 * @param {string} id
 * @returns {Promise<string>} response message from backend
 */
export async function deleteImage(id) {
  const res = await fetch(`${API_BASE}/files/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete image with status ${res.status}`);
  }
  return res.text();
}

export default { uploadImage, getAllImages, deleteImage };
