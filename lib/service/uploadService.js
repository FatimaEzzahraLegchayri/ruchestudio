// lib/services/uploadService.js

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;


export async function uploadToCloudinary(file, folderName) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Configuration Cloudinary manquante");
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  
  // This is the magic line that organizes your folders!
  formData.append("folder", folderName); 

  try {
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url; // Returns the link to save in Firestore
  } catch (error) {
    console.error("Upload Service Error:", error);
    throw error;
  }
}