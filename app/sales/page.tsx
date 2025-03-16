/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { addMultipleSales, getAllProducts, getSalesHistory } from "../utils/actions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SalesHistory from "../components/SelesHostory";

interface Product {
  id: string;
  code: string;
  name: string;
  quantity: number;
  price_v: number;
}

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const productList = await getAllProducts();
      setProducts(productList);
      const sales = await getSalesHistory();
      setSalesHistory(sales);
    }
    fetchData();
  }, []);

  const addToCart = () => {
    if (!selectedProduct || quantity <= 0) {
      toast.error("Sélectionnez un produit et entrez une quantité valide.");
      return;
    }
  
    const product = products.find((p) => p.id === selectedProduct);
    if (!product || product.quantity < quantity) {
      toast.error("Quantité insuffisante en stock.");
      return;
    }
  
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === selectedProduct);
  
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === selectedProduct
            ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * item.unitPrice }
            : item
        );
      }
  
      return [...prevCart, { productId: product.id, productName: product.name, quantity, unitPrice: product.price_v, totalPrice: product.price_v * quantity }];
    });
  
    setSelectedProduct("");
    setQuantity(1);
    toast.success("Produit ajouté au panier !");
  };
  
  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    toast.info("Produit retiré du panier.");
  };


  const handleSale = async () => {
    if (cart.length === 0) {
        toast.error("Ajoutez au moins un produit au panier.");
        return;
    }

    const confirm = await Swal.fire({
        title: "Confirmer la vente ?",
        text: "Cette action est irréversible.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, valider",
        cancelButtonText: "Annuler",
    });

    if (confirm.isConfirmed) {
        setLoading(true); // 🔹 Activer le chargement

        try {
            const result = await addMultipleSales(cart);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Vente enregistrée avec succès !");
                generateInvoice()
                setCart([]);
                const productList = await getAllProducts();
                setProducts(productList);
                const sales = await getSalesHistory();
                setSalesHistory(sales);
            }
        } catch (error) {
            toast.error("Une erreur s'est produite.");
            console.error("Erreur lors de la vente :", error);
        } finally {
            setLoading(false); // 🔹 Désactiver le chargement
        }
    }
};

const generateInvoice = () => {
  if (cart.length === 0) {
    toast.error("Aucun produit dans le panier pour générer la facture.");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 80], // Format 80x80mm
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();
  const invoiceId = `INV-${now.getTime()}`;

  // Chargement et affichage du logo
  const logo = new Image();
  logo.src = "/lok.jpg"; // Vérifie le chemin du logo

  logo.onload = () => {
    doc.addImage(logo, "PNG", 25, 5, 30, 20); // Logo centré

    // Centrage du titre
    doc.setFontSize(12);
    doc.text("Stock-App v1.0.0", 40, 30, { align: "center" });

    doc.setFontSize(8);
    doc.text(`Date: ${dateStr} ${timeStr}`, 5, 38);
    doc.text(`Facture N°: ${invoiceId}`, 5, 43);

    // Génération du tableau DÉCALÉ À GAUCHE (via margin.left)
    autoTable(doc, {
      startY: 48,
      margin: { left: 4 }, // Décalage vers la gauche
      head: [["Produit", "Qté", "P.U", "Total"]],
      body: cart.map((item) => [
        item.productName.substring(0, 10),
        item.quantity,
        item.unitPrice.toFixed(2),
        item.totalPrice.toFixed(2),
      ]),
      styles: {
        fontSize: 8,
        halign: "left", // Alignement à gauche
      },
      columnStyles: {
        0: { cellWidth: 25, halign: "left" }, // Produit (Aligné à gauche)
        1: { cellWidth: 10, halign: "center" }, // Qté
        2: { cellWidth: 15, halign: "right" }, // P.U
        3: { cellWidth: 20, halign: "right" }, // Total
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 60;

    doc.setFontSize(10);
    doc.text(
      `Total: ${cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)} MRU`,
      40,
      finalY + 5,
      { align: "center" }
    );

    // Message de remerciement centré
    doc.setFontSize(10);
    doc.text("Merci de votre achat !", 40, finalY + 15, { align: "center" });

    doc.save(`facture_${invoiceId}.pdf`);
    toast.success("Facture imprimée avec succès !");
  };
};



  
  return (
    <div className="container mx-auto p-4 max-w-md md:max-w-lg bg-white">
      <h1 className="text-xl font-bold text-center mb-4 text-black">Acheter de Produits</h1>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-black">Produit :</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border p-2 w-full rounded-md text-black"
        >
          <option value="" className="text-black">Sélectionner un produit</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (Stock: {product.quantity})
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-black">Quantité :</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 w-full rounded-md text-black"
          min="1"
        />
      </div>

      <button 
        onClick={addToCart} 
        className="mt-4 bg-gray-500 text-white p-2 rounded-md w-full hover:bg-gray-600 transition"
      >
        Ajouter au panier
      </button>

      <h2 className="mt-8 text-lg font-bold text-center text-black">Panier</h2>
      {cart.length > 0 && (
        <div className="border p-4 rounded-md bg-white">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <p className="text-sm text-black">{item.productName} - {item.quantity} x {item.unitPrice} MRU = {item.totalPrice} MRU</p>
              <button onClick={() => removeFromCart(index)} className="bg-red-500 text-white px-2 py-1 rounded">X</button>
            </div>
          ))}
          <p className="font-bold mt-2 text-black">Total: {cart.reduce((sum, item) => sum + item.totalPrice, 0)} MRU</p>
        </div>
      )}

      <button 
        onClick={handleSale} 
        className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition"
        disabled={loading}
      >
         {loading ? "Vente en cours..." : "Acheter"}
      </button>

      <button 
        onClick={generateInvoice} 
        className="mt-4 bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600 transition"
      >
        Télécharger la facture PDF
      </button>

      <div className="py-4">
    <button 
      className="bg-gray-800 text-white p-2 rounded w-full mb-4 hover:bg-gray-600"
      onClick={() => setShowSalesHistory(!showSalesHistory)}
    >
      {showSalesHistory ? "Masquer l'historique" : "Afficher l'historique"}
    </button>

    {showSalesHistory && (
      <>
        <h2 className="mt-8 text-lg font-bold text-center text-black">Historique des Ventes</h2>
        <SalesHistory sales={salesHistory} />
      </>
    )}
  </div>
    </div>
  );
}
