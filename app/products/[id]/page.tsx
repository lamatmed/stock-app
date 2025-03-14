"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProductById, updateProduct } from "../actions";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [price_v, setPriceV] = useState("0");
  const [price_a, setPriceA] = useState("0");
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const product = await getProductById(id);
      if (!product || product.error) {
        alert("Produit non trouvé !");
        router.push("/products");
        return;
      }

      setCode(product.code || "");
      setName(product.name || "");
      setQuantity(product.quantity?.toString() || "0");
      setPriceV(product.price_v?.toString() || "0");
      setPriceA(product.price_a?.toString() || "0");
      setExpirationDate(
        product.expirationDate ? new Date(product.expirationDate).toISOString().split("T")[0] : ""
      );
    } catch (error) {
      console.error("Erreur lors de la récupération du produit :", error);
      alert("Une erreur est survenue !");
      router.push("/products");
    }
  };

  const handleUpdate = async () => {
    if (!code || !name || !quantity || !price_v || !price_a || !expirationDate) {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: "Veuillez remplir tous les champs !",
      });
      return;
    }
  
    try {
      const result = await Swal.fire({
        title: "Modifier le produit ?",
        text: "Êtes-vous sûr de vouloir enregistrer ces modifications ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui, modifier",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
  
      if (result.isConfirmed) {
        // Afficher un message de chargement
        Swal.fire({
          title: "Modification en cours...",
          text: "Veuillez patienter",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
  
        await updateProduct(
          id,
          code,
          name,
          parseInt(quantity),
          parseFloat(price_v),
          parseFloat(price_a),
          expirationDate
        );
  
        Swal.close(); // Fermer le message de chargement
        toast.success("Produit mis à jour avec succès !");
        router.push("/products");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      Swal.close();
      toast.error("Une erreur est survenue lors de la mise à jour !");
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Modifier un Produit</h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Code du produit"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Nom du produit"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Quantité"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Prix de vente"
          type="number"
          value={price_v}
          onChange={(e) => setPriceV(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Prix d'achat"
          type="number"
          value={price_a}
          onChange={(e) => setPriceA(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={handleUpdate}>
          Modifier le produit
        </button>
      </div>
    </div>
  );
}
