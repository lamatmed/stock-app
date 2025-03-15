"use server";
interface SaleRecord {
  productId: string;
  quantity: number;
  totalPrice: number;
  purchasePrice: number;
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Récupérer tous les produits
export async function getAllProducts() {
  try {
    return await prisma.product.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        quantity: true,
        price_v: true,
        price_a: true,
        expirationDate: true,
        imageUrl: true, // Ajout de l'image
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return [];
  }
}

// 🔹 Ajouter un produit
export async function addProduct(
  code: string,
  name: string,
  quantity: number,
  price_v: number,
  price_a: number,
  expirationDate: string,
  imageUrl: string // Ajout de l'image
) {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { code },
    });

    if (existingProduct) {
      return { error: "Ce code de produit existe déjà !" };
    }

    if (price_v <= price_a) {
      return { error: "Le prix de vente doit être supérieur au prix d'achat !" };
    }

    if (quantity < 0) {
      return { error: "La quantité ne peut pas être négative !" };
    }

    await prisma.product.create({
      data: {
        code,
        name,
        quantity,
        price_v,
        price_a,
        expirationDate: new Date(expirationDate),
        imageUrl, // Stocker l'image
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    return { error: "Erreur lors de l'ajout du produit" };
  }
}

// 🔹 Modifier un produit
export async function updateProduct(
  id: string,
  code: string,
  name: string,
  quantity: number,
  price_v: number,
  price_a: number,
  expirationDate: string,
  imageUrl: string // Mise à jour de l'image
) {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        code,
        name,
        quantity,
        price_v,
        price_a,
        expirationDate: new Date(expirationDate),
        imageUrl, // Mise à jour de l'image
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la modification du produit:", error);
    return { error: "Erreur lors de la modification du produit" };
  }
}

// 🔹 Supprimer un produit
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return { error: "Erreur lors de la suppression du produit" };
  }
}

// 🔹 Récupérer un produit par son ID
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        quantity: true,
        price_v: true,
        price_a: true,
        expirationDate: true,
        createdAt: true,
        imageUrl: true, // Ajout de l'image
      },
    });

    if (!product) {
      return { error: "Produit non trouvé" };
    }

    return {
      ...product,
      expirationDate: product.expirationDate.toISOString(),
      createdAt: product.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return { error: "Erreur lors de la récupération du produit" };
  }
}

// 🔹 Récupérer les 5 derniers produits ajoutés
export async function getLatestProducts() {
  try {
    const latestProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        code: true,
        name: true,
        quantity: true,
        price_v: true,
        price_a: true,
        expirationDate: true,
        imageUrl: true, // Ajout de l'image
      },
    });

    return latestProducts;
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers produits :", error);
    return [];
  }
}

// 🔹 Récupérer les statistiques du dashboard
export async function getDashboardStats() {
  try {
    const totalProducts = await prisma.product.count();

    const sales = await prisma.sale.findMany({
      select: {
        totalPrice: true,
        purchasePrice: true,
      },
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalPurchaseCost = sales.reduce((sum, sale) => sum + sale.purchasePrice, 0);
    const totalProfit = totalSales - totalPurchaseCost;

    const totalOrders = await prisma.sale.count();

    return {
      totalProducts,
      totalSales: totalSales || 0,
      totalProfit: totalProfit || 0,
      totalOrders,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    return {
      totalProducts: 0,
      totalSales: 0,
      totalProfit: 0,
      totalOrders: 0,
    };
  }
}


export async function addMultipleSales(salesData: { productId: string; quantity: number }[]) {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: { in: salesData.map(sale => sale.productId) },
      },
    });

    let totalAmount = 0;
    let purchaseTotal = 0;
    const salesRecords: SaleRecord[] = [];

    // Vérifier que tous les produits ont assez de stock
    for (const sale of salesData) {
      const product = products.find(p => p.id === sale.productId);
      if (!product) return { error: `Produit introuvable: ${sale.productId}` };
      if (product.quantity < sale.quantity) return { error: `Stock insuffisant pour ${product.name}` };

      const totalPrice = product.price_v * sale.quantity;
      const purchasePrice = product.price_a * sale.quantity;
      totalAmount += totalPrice;
      purchaseTotal += purchasePrice;

      salesRecords.push({
        productId: sale.productId,
        quantity: sale.quantity,
        totalPrice,
        purchasePrice,
      });
    }

    // Création de la facture et enregistrement des ventes
    const saleTransaction = await prisma.$transaction(async (prisma) => {
      const invoice = await prisma.invoice.create({
        data: {
          totalAmount,
          purchaseTotal,
        },
      });

      for (const record of salesRecords) {
        await prisma.sale.create({
          data: {
            ...record,
            invoiceId: invoice.id,
          },
        });

        await prisma.product.update({
          where: { id: record.productId },
          data: {
            quantity: { decrement: record.quantity },
          },
        });
      }

      return invoice.id;
    });

    return { success: true, invoiceId: saleTransaction };
  } catch (error) {
    console.error("Erreur lors de l'ajout des ventes:", error);
    return { error: "Erreur lors de l'ajout des ventes" };
  }
}

// 🔹 Récupérer l'historique des ventes
export async function getSalesHistory() {
  try {
    const sales = await prisma.sale.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return sales.map((sale) => ({
      id: sale.id,
      productName: sale.product.name,
      quantity: sale.quantity,
      totalPrice: sale.totalPrice,
      purchasePrice: sale.purchasePrice,
      createdAt: sale.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des ventes:", error);
    return [];
  }
}
