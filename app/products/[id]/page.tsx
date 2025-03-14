import EditProduct from "@/app/components/Edit";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // 👈 On utilise `use()` pour attendre `params`

  return <EditProduct id={id} />;
}
