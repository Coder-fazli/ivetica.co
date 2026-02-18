"use server";

 import { writeFile } from "fs/promises";
 import path from "path";

export async function uploadImage(formData: FormData) {
    const file = formData.get("file") as File;
     if (!file) return { error: "No file uploaded" }

     // Validate file type and size
      const allowedTypes = ["image/jpeg", "image/png",
  "image/svg+xml", "image/webp"];
     if (!allowedTypes.includes(file.type)) {
        return { error: "Invalid file type" }
     }
      if (file.size > 5 * 1024 * 1024) {
        return { error: "File too large. Max 5MB" }
      }

     const bytes = await file.arrayBuffer();
     const buffer = Buffer.from(bytes);

     const filename = Date.now() + "_" + file.name;
     const filepath = path.join(process.cwd(), "public/img/uploads", filename)

     await writeFile(filepath, buffer);

     return { url: "/img/uploads/" + filename }
}