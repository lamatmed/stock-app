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
    <div className="mb-4 text-black text-center">
      <UploadButton<OurFileRouter,"imageUploader">
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res?.[0]?.url) {
            setUploadedUrl(res[0].url);
            onUpload(res[0].url); // ✅ Passe l'URL au parent
          }
        }}
        onUploadError={(error) => alert(`Erreur d'upload: ${error.message}`)}
         className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto text-sm"
      />
     {uploadedUrl && (
  <Image
    src={uploadedUrl}
    alt="Image du produit"
    width={150}
    height={150}
   className="w-full sm:w-32 h-32 sm:h-32 object-cover rounded-md mb-3"
    priority // ⚡ Charge l'image plus rapidement
    unoptimized // Désactive l'optimisation si l'image est externe
  />
)}
    </div>
  );
}
