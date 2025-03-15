import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload terminé:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
