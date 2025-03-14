"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct } from "../actions";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function AddProduct() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price_v, setPriceV] = useState("");
  const [price_a, setPriceA] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const handleAddProduct = async () => {
    if (!code || !name || !quantity || !price_v || !price_a || !expirationDate) {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: "Veuillez remplir tous les champs !",
      });
      return;
    }
  
    if (parseInt(quantity) < 0) {
      Swal.fire({
        icon: "error",
        title: "Valeur invalide",
        text: "La quantité ne peut pas être négative !",
      });
      return;
    }
  
    if (parseFloat(price_v) <= parseFloat(price_a)) {
      Swal.fire({
        icon: "error",
        title: "Prix incorrect",
        text: "Le prix de vente doit être supérieur au prix d'achat !",
      });
      return;
    }
  
    try {
      const result = await Swal.fire({
        title: "Ajouter ce produit ?",
        text: "Voulez-vous vraiment ajouter ce produit ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui, ajouter",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
  
      if (result.isConfirmed) {
        Swal.fire({
          title: "Ajout en cours...",
          text: "Veuillez patienter",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
  
        const response = await addProduct(
          code,
          name,
          parseInt(quantity),
          parseFloat(price_v),
          parseFloat(price_a),
          expirationDate
        );
  
        Swal.close();
  
        if (response.error) {
          Swal.fire({
            icon: "error",
            title: "Impossible d'ajouter",
            text: response.error,
          });
          return;
        }
  
        toast.success("Produit ajouté avec succès !");
        router.push("/products");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      Swal.close();
      toast.error("Une erreur est survenue lors de l'ajout !");
    }
  };
  
  
  
  return (
    <div className="max-w-2xl mx-auto p-4  bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">Ajouter un Produit</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <input className="border p-2 w-full mb-2 rounded placeholder:text-black text-black" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <input className="border p-2 w-full mb-2 rounded placeholder:text-black text-black" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 w-full mb-2 placeholder:text-black text-black" type="number" placeholder="Quantité" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input className="border p-2 w-full mb-2 placeholder:text-black text-black"type="number" placeholder="Prix de vente" value={price_v} onChange={(e) => setPriceV(e.target.value)} />
        <input className="border p-2 w-full mb-2 placeholder:text-black text-black" type="number" placeholder="Prix d'achat" value={price_a} onChange={(e) => setPriceA(e.target.value)} />
        <input className="border p-2 w-full mb-2 text-black" type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
        
        <button className="bg-green-500 text-white p-2 rounded w-full mt-2" onClick={handleAddProduct}>
          Ajouter
        </button>
      </div>
    </div>
  );
}
