# 博客分类功能需求文档

## 目标
在首页与博客列表页新增“博客分类”组件，支持按分类跳转到分类页，并按创建时间排序展示博客。

## 功能范围
- 新增一个可复用的分类组件，用于展示分类列表（横向一排，可换行）。
- 首页 `/` 与博客页 `/blog` 展示分类组件。
- 点击分类进入分类页，展示该分类下的博客列表。

## 页面与组件
### 分类组件
- 位置：新增至 `app/components`（命名以实现阶段确认）。
- 展示形式：一排标签/链接（示例：`[tech] / [learning] / [summary] / [product-docs]`）。
- 点击行为：跳转到对应分类页。
- 可选交互：当前分类高亮（如果在分类页）。

### 首页
- 在介绍文案与博客列表之间插入分类组件。

### 博客页
- 在标题下方插入分类组件。

### 分类页
- 路由：`/blog/category/[slug]`。
- 页面内容：当前分类标题 + 该分类的博客列表。
- 列表排序：按创建时间倒序。
- 空态：分类无文章时给出提示。

## 数据规范
### 博客 frontmatter
- 分类写在博客内容的 frontmatter 中，支持多分类。
- 创建时间写在 frontmatter 中，使用字段 `createdAt`。

建议字段（示例）：
```md
---
title: "标题"
createdAt: "2024-01-09"
summary: "摘要"
categories: ["tech", "learning"]
---
```

### 分类配置（可选）
如需显示名与 slug 分离，建议新增统一配置文件（例如 `app/blog/categories.ts`），集中维护：
- `name`：显示名
- `slug`：URL 用 slug
- `order`：显示顺序（可选）
文章 frontmatter 仅写 slug（例如 `categories: ["product-docs"]`），避免重复映射。

### 分类与排序规则
- 分类来源：`categories` 字段（数组，多分类）。
- 排序规则：按创建时间倒序。
- 分类集合：从所有博客 frontmatter 聚合生成。
- 分类使用英文，手动配置，不做自动翻译。
- 非英文或缺失分类：归入“未分类”。
- 分类 slug：单分类 slug，不支持多分类 slug。
- 未分类处理：显示名为“未分类”，固定 slug 为 `uncategorized`。
- 创建时间缺失处理：`createdAt` 缺失时使用当前最新时间。
- 创建时间缺失文章：额外加入“没有日期”分类，显示名为“没有日期”，固定 slug 为 `no-date`。
- 多分类文章：允许在多个分类页中重复出现。

## 路由与 SEO
- 分类页需配置基础 metadata（标题、描述）。
- sitemap 是否包含分类页 URL：需确认（建议加入）。

## 实现步骤（建议）
1. **补充数据结构**
   - 在 `app/blog/utils.ts` 的 metadata 类型中加入 `createdAt?: string` 与 `categories?: string[]`。
   - 统一使用 `createdAt` 作为排序字段。
2. **确定分类与 slug 规范**
   - 分类值必须是英文、手动配置；否则归入“未分类”。
   - “未分类”显示名固定为中文，slug 固定为 `uncategorized`。
   - “没有日期”显示名固定为中文，slug 固定为 `no-date`。
3. **（可选）新增分类配置文件**
   - 新建 `app/blog/categories.ts`，维护 `name/slug/order` 列表。
   - frontmatter 只写 slug（如 `categories: ["product-docs"]`），显示名由配置映射。
4. **完善数据读取与兜底**
   - 在 `getBlogPosts()` 结果中规范化字段：
     - `categories` 缺失或包含非英文时，替换为 `["uncategorized"]`。
     - `createdAt` 缺失时，使用当前最新日期，并额外标记为“没有日期”分类。
   - 创建工具函数：
     - `normalizeCategories(post)`：处理非英文/缺失分类。
     - `getAllCategories(posts)`：汇总分类集合与计数，包含 `uncategorized`、`no-date`。
     - `getPostsByCategory(slug)`：按分类筛选 + 倒序排序。
5. **新增分类组件**
   - 在 `app/components` 新建分类组件，渲染分类列表（横向可换行）。
   - 组件输入：分类集合 + 当前激活 slug。
   - 交互：点击分类跳转 `/blog/category/[slug]`，当前分类高亮。
6. **接入首页与博客页**
   - `app/page.tsx`：在介绍文案与博客列表之间插入分类组件。
   - `app/blog/page.tsx`：在标题下方插入分类组件。
7. **新增分类页**
   - 新建 `app/blog/category/[slug]/page.tsx`。
   - 生成静态参数：从 `getAllCategories` 取 slug 列表。
   - 页面内容：分类标题 + 博客列表；使用 `getPostsByCategory(slug)`。
   - 空态：无文章时显示提示。
8. **多分类展示规则**
   - 同一篇文章在多个分类页允许重复出现（按分类筛选自然得到）。
9. **更新时间排序**
   - 博客列表统一按 `createdAt` 倒序。
   - 若 `createdAt` 缺失，用“最新日期”参与排序。
10. **sitemap（若确认加入）**
    - `app/sitemap.ts` 追加分类页 URL。
11. **补齐文章 frontmatter**
    - 为现有文章补 `createdAt` 与 `categories`。
    - 非英文分类迁移为英文 slug 或归入 `uncategorized`。
12. **校验**
    - 首页与博客页分类显示正确。
    - 分类页路由可访问，空分类有提示。
    - 排序与“未分类/没有日期”逻辑符合预期。
