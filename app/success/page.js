import OrderStatus from "@/components/OrderStatus";

export const metadata = { title: "Order status | Marginalia Books" };

export default async function SuccessPage({ searchParams }) {
  const { order_id: orderId } = await searchParams;
  return <OrderStatus orderId={orderId} />;
}
