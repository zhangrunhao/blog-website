import Link from "next/link";
import type { ReactNode } from "react";

type BaseProduct = {
  id: string;
  title: string;
  description: string;
  cover: string;
  coverAlt?: string;
};

type DetailProduct = BaseProduct & {
  type: "detail";
  detailUrl: string;
  downloadUrl: string;
};

type DemoProduct = BaseProduct & {
  type: "demo";
  demoUrl: string;
};

export type ProductItem = DetailProduct | DemoProduct;

type ProductsProps = {
  items?: ProductItem[];
  emptyText?: string;
};

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

const getProductHref = (product: ProductItem) =>
  product.type === "detail" ? product.detailUrl : product.demoUrl;

function CardLink({
  href,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  className: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  if (isExternalUrl(href)) {
    return (
      <a
        className={className}
        href={href}
        aria-label={ariaLabel}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

const sampleProducts: ProductItem[] = [
  {
    id: "card-game-demo",
    title: "卡牌游戏在线 Demo",
    description: "即时对战的卡牌策略玩法，支持在线体验与快速上手规则说明。",
    cover:
      "https://zhangrunhao.oss-cn-beijing.aliyuncs.com/iShot_2026-01-19_17.45.27.png",
    coverAlt: "卡牌游戏在线体验",
    type: "demo",
    demoUrl: "http://101.200.185.29/",
  },
  // {
  //   id: "birthday-manager",
  //   title: "生日管理 App",
  //   description:
  //     "帮你记录亲友生日与重要日程，支持提醒与个性化祝福模板，方便日常维护关系。",
  //   cover:
  //     "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  //   coverAlt: "生日提醒与管理",
  //   type: "detail",
  //   detailUrl: "/product/birthday-manager",
  //   downloadUrl: "https://example.com/app-store/birthday-manager",
  // },
  // {
  //   id: "card-game-demo",
  //   title: "卡牌游戏在线 Demo",
  //   description: "即时对战的卡牌策略玩法，支持在线体验与快速上手规则说明。",
  //   cover:
  //     "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
  //   coverAlt: "卡牌游戏在线体验",
  //   type: "demo",
  //   demoUrl: "https://example.com/demo/card-game",
  // },
  // {
  //   id: "card-game-demo-2",
  //   title: "卡牌游戏 Demo 2",
  //   description: "第二套卡牌玩法演示，包含新机制与更快的对局节奏。",
  //   cover:
  //     "https://images.unsplash.com/photo-1519885273780-103e8b9d6c8a?auto=format&fit=crop&w=1200&q=80",
  //   coverAlt: "卡牌游戏演示 2",
  //   type: "demo",
  //   demoUrl: "https://example.com/demo/card-game-2",
  // },
  // {
  //   id: "budget-book",
  //   title: "记账 App",
  //   description:
  //     "简洁的收支记录与账单统计，支持分类预算与月度报表导出。",
  //   cover:
  //     "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  //   coverAlt: "记账与预算管理",
  //   type: "detail",
  //   detailUrl: "/product/budget-book",
  //   downloadUrl: "https://example.com/app-store/budget-book",
  // },
];

export function Products({
  items = sampleProducts,
  emptyText = "暂无产品",
}: ProductsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 min-[576px]:grid-cols-2 min-[768px]:grid-cols-3">
      {items.map((product) => {
        const href = getProductHref(product);
        const altText = product.coverAlt ?? product.title;

        return (
          <CardLink
            key={product.id}
            href={href}
            ariaLabel={product.title}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
              <img
                src={product.cover}
                alt={altText}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              <h3 className="text-sm font-semibold leading-5 text-neutral-900 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-sm leading-5 text-neutral-600 line-clamp-2">
                {product.description}
              </p>
            </div>
          </CardLink>
        );
      })}
    </div>
  );
}
