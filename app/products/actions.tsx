"use server";

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

// 🔹 Ajouter une vente et mettre à jour le stock
export async function addSale(productId: string, quantity: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { error: "Produit introuvable" };
    }

    if (product.quantity < quantity) {
      return { error: "Stock insuffisant" };
    }

    const totalPrice = product.price_v * quantity;
    const purchasePrice = product.price_a * quantity;

    await prisma.sale.create({
      data: {
        productId,
        quantity,
        totalPrice,
        purchasePrice,
      },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: product.quantity - quantity,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la vente:", error);
    return { error: "Erreur lors de l'ajout de la vente" };
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
