import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface UploaderProps {
  onUpload: (url: string) => void;
}

export default function Uploader({ onUpload }: UploaderProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  return (
    <div className="mb-2 text-black">
      <UploadButton<OurFileRouter,"imageUploader">
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res?.[0]?.url) {
            setUploadedUrl(res[0].url);
            onUpload(res[0].url); // ✅ Passe l'URL au parent
          }
        }}
        onUploadError={(error) => alert(`Erreur d'upload: ${error.message}`)}
        className="bg-black hover:bg-blue-700 text-white"
      />
      {uploadedUrl && <img src={uploadedUrl} alt="Aperçu" className="mt-2 max-w-xs text-black" />}
    </div>
  );
}
