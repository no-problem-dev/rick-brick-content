---
title: "Astro Content Collections 完全ガイド：型安全なコンテンツ管理"
summary: "Astro の Content Collections を使って型安全にMarkdownコンテンツを管理する方法を解説。Zodスキーマによるバリデーションからクエリまで。"
date: "2024-02-20"
category: tech-article
tags: ["Astro", "TypeScript", "SSG", "Web開発"]
automated: false
---

## はじめに

Astro の **Content Collections** は、Markdown / MDX ファイルをコレクションとして管理し、型安全にコンテンツをクエリするための機能です。Astro 2.0 で導入され、現在のバージョンでは静的サイトのコンテンツ管理のデファクトスタンダードとなっています。

Content Collections の最大の利点は **Zod スキーマによるフロントマターのバリデーション** です。スキーマに合わない frontmatter を持つファイルがあればビルド時にエラーとなり、型定義が自動で生成されます。「記事のタグを入れ忘れた」「日付の形式を間違えた」といった人的ミスをコンパイル時に発見できます。

このガイドでは、Content Collections の設定から実際のクエリまでを順を追って解説します。

## 技術解説

### コレクション定義（src/content/config.ts）

まず `src/content/config.ts` でスキーマを定義します。Zod を使って各フィールドの型・バリデーションルールを宣言します。

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    category: z.enum(['paper-review', 'ai-news-digest', 'tech-article']),
    tags: z.array(z.string()).min(1),
    thumbnail: z.string().optional(),
    automated: z.boolean(),
  }),
});

export const collections = { articles };
```

`z.enum()` でカテゴリの値を限定し、`z.array(z.string()).min(1)` でタグが最低1件必要であることを強制できます。`optional()` で任意フィールドを表現します。

### コンテンツファイルの配置

コレクション名と同名のディレクトリを `src/content/` 以下に作成し、Markdown ファイルを配置します。

```
src/content/
└── articles/
    ├── transformer-overview.md
    ├── diffusion-models.md
    └── astro-guide.md
```

### コンテンツのクエリ

Astro ページからは `getCollection()` または `getEntry()` でコンテンツをクエリできます。

```typescript
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';

// 全記事を取得（automatedフィルタ例）
const allArticles = await getCollection('articles');

// 特定カテゴリのみ取得し、日付順にソート
const paperReviews = await getCollection('articles', ({ data }) =>
  data.category === 'paper-review'
);

const sorted = paperReviews.sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
---
```

`getCollection()` の第2引数にフィルタ関数を渡せます。`data` は Zod スキーマで定義した型が自動で付いているため、`data.category` なども型補完が効きます。

### 記事ページの動的生成

```typescript
---
// src/pages/articles/[slug].astro
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((article) => ({
    params: { slug: article.slug },
    props: { article },
  }));
}

const { article } = Astro.props;
const { Content, headings } = await render(article);
---

<article>
  <h1>{article.data.title}</h1>
  <Content />
</article>
```

`render()` を呼ぶと `Content` コンポーネントと `headings`（目次生成用）が返ります。Remark / Rehype プラグインもここで適用されます。

### スキーマの継承・拡張パターン

カテゴリごとに異なるフィールドを持つ場合、基底スキーマを `extend()` で拡張する方法が有効です。

```typescript
const baseSchema = z.object({
  title: z.string(),
  date: z.string(),
  tags: z.array(z.string()).min(1),
});

const paperReviewSchema = baseSchema.extend({
  paper_url: z.string().url(),
  paper_title: z.string(),
});
```

## まとめ

Content Collections は Astro で静的サイトを構築する際の必須機能です。Zod スキーマによる型安全性は開発体験を大幅に向上させ、フロントマターのミスをビルド時に発見できる安心感は実際の運用で大きな価値を発揮します。

特に複数人での開発や自動生成スクリプトでコンテンツを作成する場合、スキーマバリデーションの恩恵は絶大です。まだ使っていない方はぜひ導入を検討してみてください。
