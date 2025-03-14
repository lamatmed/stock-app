import EditProduct from "@/app/components/Edit";

export default function Page({ params }: { params: { id: string } }) {
  return <EditProduct id={params.id} />;
}
