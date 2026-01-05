import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">个人介绍</h1>
      <p className="mb-4">
        我是一名前端开发者，喜欢各种各样的技术，最近想做点实际有用的东西，这个网站用来记录自己的天马行空的想法、产品日记，还有实际上线的产品列表。
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
