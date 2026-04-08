import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      const { getAllProducts, getDiscountByProductId } = await import("../server/db");
      const products = await getAllProducts();
      const productsWithDiscount = await Promise.all(
        products.map(async (product) => {
          const discount = await getDiscountByProductId(product.id);
          return { ...product, discount };
        })
      );
      return productsWithDiscount;
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getProductById, getDiscountByProductId } = await import("../server/db");
        const product = await getProductById(input.id);
        if (!product) return null;
        const discount = await getDiscountByProductId(product.id);
        return { ...product, discount };
      }),
    
    create: protectedProcedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { createProduct } = await import("../server/db");
        return createProduct(input);
      }),
    
    update: protectedProcedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { updateProduct } = await import("../server/db");
        const { id, ...data } = input;
        return updateProduct(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { deleteProduct } = await import("../server/db");
        return deleteProduct(input.id);
      }),
  }),

  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      const { getAllOrders, getOrderItems } = await import("../server/db");
      const orders = await getAllOrders();
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await getOrderItems(order.id);
          return { ...order, items };
        })
      );
      return ordersWithItems;
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getOrderById, getOrderItems } = await import("../server/db");
        const order = await getOrderById(input.id);
        if (!order) return null;
        const items = await getOrderItems(order.id);
        return { ...order, items };
      }),
    
    create: publicProcedure
      .input(z.any())
      .mutation(async ({ input }) => {
        const { createOrder, createOrderItem } = await import("../server/db");
        const { items, ...orderData } = input;
        const result = await createOrder(orderData);
        if (result && items && Array.isArray(items)) {
          for (const item of items) {
            await createOrderItem({ ...item, orderId: (result as any).insertId });
          }
        }
        return result;
      }),
    
    updateStatus: protectedProcedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { updateOrder } = await import("../server/db");
        const { id, paymentStatus } = input;
        return updateOrder(id, { paymentStatus });
      }),
  }),

  discounts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      const { getAllDiscounts } = await import("../server/db");
      return getAllDiscounts();
    }),
    
    create: protectedProcedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { createDiscount } = await import("../server/db");
        return createDiscount(input);
      }),
    
    update: protectedProcedure
      .input(z.any())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { updateDiscount } = await import("../server/db");
        const { id, ...data } = input;
        return updateDiscount(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { deleteDiscount } = await import("../server/db");
        return deleteDiscount(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
