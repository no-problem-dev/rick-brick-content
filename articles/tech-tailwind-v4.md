---
title: "Tailwind CSS v4 移行ガイド：CSS-first な設定アプローチ"
summary: "Tailwind CSS v4 の主要な変更点と移行手順を解説。CSS-first な設定、@theme ディレクティブ、パフォーマンス改善について。"
date: "2024-05-01"
category: tech-article
tags: ["Tailwind CSS", "CSS", "Web開発", "フロントエンド"]
automated: false
---

## はじめに

Tailwind CSS v4 は、v3 までの JavaScript ベースの設定を大幅に見直した **CSS-first アーキテクチャ**への転換を果たしたメジャーバージョンです。`tailwind.config.js` から `@theme` ディレクティブへ、設定方法がシフトしたことにより、より直感的なカスタマイズと大幅なビルドパフォーマンスの向上が実現されました。

v3 から v4 への移行は破壊的変更を含みますが、多くのプロジェクトでは移行作業は想定より少ない工数で完了できます。このガイドでは主要な変更点を解説し、実際の移行手順をステップバイステップで説明します。

## 技術解説

### CSS-first 設定：@theme ディレクティブ

v4 最大の変更は、テーマのカスタマイズが **CSS ファイル内の `@theme` ディレクティブ** で行えるようになったことです。

**v3 の設定方法（tailwind.config.js）**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#FF6B35',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

**v4 の設定方法（CSSファイル）**:
```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-brand: #FF6B35;
  --font-family-sans: 'Inter', sans-serif;
  --spacing-18: 4.5rem;
}
```

CSS カスタムプロパティ（CSS 変数）としてデザイントークンを定義することで、JavaScript の設定ファイルを必要とせずカスタマイズが完結します。定義したトークンは自動的にユーティリティクラス（`text-brand`、`font-sans`、`p-18` 等）として使用可能になります。

### インストールとセットアップ

```bash
npm install tailwindcss@latest @tailwindcss/vite
# または
npm install tailwindcss@latest @tailwindcss/postcss
```

v4 では Vite プラグインが提供されており、PostCSS を経由しない高速なビルドパスを選択できます。

```javascript
// vite.config.js
import tailwindcss from '@tailwindcss/vite';

export default {
  plugins: [tailwindcss()],
};
```

エントリーポイントの CSS ファイルに `@import "tailwindcss"` の1行を追加するだけで基本設定が完了します。v3 の `@tailwind base; @tailwind components; @tailwind utilities;` は不要になりました。

### 主要な変更点と移行ポイント

**1. content 設定が不要に**

v3 では `content` 配列でスキャン対象ファイルを明示する必要がありましたが、v4 では自動検出されます。

```javascript
// v3: 明示が必要だった
content: ['./src/**/*.{html,js,ts,jsx,tsx,astro}']

// v4: 不要（自動検出）
```

**2. ユーティリティクラスの命名変更**

一部のクラス名が変更されています。移行ツール（`@tailwindcss/upgrade`）を使うと自動変換可能です。

```bash
npx @tailwindcss/upgrade
```

主な変更例:
- `shadow-sm` → `shadow-xs`
- `blur` → `blur-sm`
- `overflow-ellipsis` → `text-ellipsis`

**3. arbitrary values の変更**

カスタム値を直接記述する Arbitrary Values 構文は引き続き使用可能ですが、CSS 変数参照の記法が変わりました。

```html
<!-- v3 -->
<div class="bg-[var(--color-primary)]">

<!-- v4 -->
<div class="bg-(--color-primary)">
```

### パフォーマンス改善

v4 は Rust で書かれた新エンジン（Lightning CSS）を採用し、ビルド速度が劇的に向上しています。公式の計測では、大規模プロジェクトで **最大10倍以上の高速化** が報告されています。

開発時のホットリロードも高速化され、スタイル変更がほぼ即時に反映されるようになりました。

## まとめ

Tailwind CSS v4 への移行は、CSS-first な設定への概念的な転換を伴いますが、移行ツールの充実により実作業のコストは抑えられています。長期的には JavaScript 設定ファイルの管理から解放され、CSS のみで完結するよりシンプルな開発体験が得られます。

新規プロジェクトではv4 を選択することを強く推奨します。既存プロジェクトも、次のメジャーアップデートのタイミングで移行を計画するとよいでしょう。
