import { toast } from "sonner";

export const uploadImageToImgBB = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("ImgBB API key is missing. Check your environment variables.");
      return null;
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.display_url;
    } else {
      toast.error(data.error?.message || "Failed to upload image to ImgBB.");
      return null;
    }
  } catch (error) {
    console.error("Image upload error:", error);
    toast.error("An error occurred while uploading the image.");
    return null;
  }
};
