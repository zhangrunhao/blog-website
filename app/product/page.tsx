import { Products } from "app/components/products";

export const metadata = {
  title: "产品列表",
  description: "产品和Demo列表",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">产品列表</h1>
      <Products />
    </section>
  );
}
