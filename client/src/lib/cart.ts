export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl?: string;
  discount?: {
    discountType: string;
    discountValue: number;
  };
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
}

const CART_STORAGE_KEY = "umkm_cart";

export function getCart(): Cart {
  if (typeof window === "undefined") {
    return { items: [], totalAmount: 0, discountAmount: 0, finalAmount: 0 };
  }

  const cart = localStorage.getItem(CART_STORAGE_KEY);
  if (!cart) {
    return { items: [], totalAmount: 0, discountAmount: 0, finalAmount: 0 };
  }

  try {
    return JSON.parse(cart);
  } catch {
    return { items: [], totalAmount: 0, discountAmount: 0, finalAmount: 0 };
  }
}

export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function calculatePriceAfterDiscount(price: number, discount?: { discountType: string; discountValue: number }): number {
  if (!discount) return price;

  if (discount.discountType === "percentage") {
    return price - (price * discount.discountValue) / 100;
  } else if (discount.discountType === "fixed") {
    return Math.max(0, price - discount.discountValue);
  }

  return price;
}

export function addToCart(item: CartItem): Cart {
  let cart = getCart();
  const existingItem = cart.items.find((i) => i.productId === item.productId);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  cart = recalculateCart(cart);
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: number): Cart {
  let cart = getCart();
  cart.items = cart.items.filter((i) => i.productId !== productId);
  cart = recalculateCart(cart);
  saveCart(cart);
  return cart;
}

export function updateCartItemQuantity(productId: number, quantity: number): Cart {
  let cart = getCart();
  const item = cart.items.find((i) => i.productId === productId);

  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }
  }

  cart = recalculateCart(cart);
  saveCart(cart);
  return cart;
}

export function recalculateCart(cart: Cart): Cart {
  let totalAmount = 0;
  let discountAmount = 0;

  cart.items.forEach((item) => {
    const pricePerItem = calculatePriceAfterDiscount(item.price, item.discount);
    const itemTotal = pricePerItem * item.quantity;
    totalAmount += item.price * item.quantity;
    discountAmount += (item.price - pricePerItem) * item.quantity;
  });

  cart.totalAmount = totalAmount;
  cart.discountAmount = discountAmount;
  cart.finalAmount = totalAmount - discountAmount;

  return cart;
}

export function clearCart(): Cart {
  const emptyCart: Cart = { items: [], totalAmount: 0, discountAmount: 0, finalAmount: 0 };
  saveCart(emptyCart);
  return emptyCart;
}
