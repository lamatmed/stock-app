import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";

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
      {uploadedUrl && <Image src={uploadedUrl} alt="Aperçu"  width={300} // Remplace par la largeur de ton image
  height={200} // Remplace par la hauteur de ton image
  priority />}
    </div>
  );
}
