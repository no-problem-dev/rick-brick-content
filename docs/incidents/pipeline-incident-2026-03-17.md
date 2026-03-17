# Pipeline Incident Report: 2026-03-17

## 概要

| 項目 | 内容 |
|------|------|
| 発生日時 | 2026-03-17 12:38 UTC |
| 検出方法 | 手動トリガーによるパイプライン動作検証 |
| ワークフロー Run ID (1回目) | `23194567444` — research ERROR（Claude API web_search ツール定義の不備） |
| ワークフロー Run ID (2回目) | `23194675600` — research OK だがサムネイル・バリデーション失敗 |
| プロバイダー | Claude (`claude-haiku-4-5`) |
| 影響 | 不正ファイル `images/.png` が main に push。品質チェックが全スキップ |

---

## 発見された問題

### P1: Imagen API モデル名の廃止（Critical）

**事象**: `thumbnail.ts` が `imagen-3.0-generate-002` モデルで Gemini Imagen API を呼び出したが、HTTP 404 が返った。

**エラーメッセージ**:
```
models/imagen-3.0-generate-002 is not found for API version v1beta,
or is not supported for predict. Call ListModels to see the list of available models.
```

**影響**: サムネイル生成が全件失敗し、フォールバックが発動。しかし slug が空のためフォールバック先も不正（P2 と連鎖）。

**根本原因**: `imagen-3.0-generate-002` が Gemini API v1beta から削除された。

### P2: slug が空文字でもサムネイル生成が続行（High）

**事象**: `thumbnail.ts` が `result.frontmatter.slug` を取得するが、値が空文字。
結果として `images/.png` という不正なファイルが生成・push された。

**影響**:
- `images/.png` がリポジトリに commit された
- `updateArticleThumbnail()` が記事ファイルを見つけられずスキップ

**根本原因**: slug 解決ロジックに空文字ガードがなく、フォールバックも未実装。

### P3: validate.ts と generate.ts の slug 取得ロジック不一致（High）

**事象**: `validate.ts` は `research.frontmatter?.slug` → `${today}-${slug}.md` でファイルを探すが、
`generate.ts` は markdown 本文の `slug:` 正規表現で slug を取得する。
両者が異なる slug を算出した場合、validate がファイルを見つけられない。

**ログ**:
```
paper-review: file not found (articles/2026-03-17-.md), skipping
ai-news-digest: file not found (articles/2026-03-17-.md), skipping
```

**影響**: 品質チェックが全スキップされ、不正な記事が検出されずに push された。

**根本原因**: slug 解決ロジックが `generate.ts`・`thumbnail.ts`・`validate.ts` の3箇所に分散しており、一貫性が保証されていない。

### 補足: 1回目の実行で発見された追加問題

**事象**: Claude API の `web_search` ツール定義で `type: 'web_search'` を使用していたが、
正しくは `type: 'web_search_20250305'` であり、API エラーで research が全件失敗した。

**対応**: `claude-provider.ts` の修正をその場で実施済み（commit `694272f`）。

---

## 根本原因分析

```
                    slug 解決ロジックの分散
                   ┌────────────────────────┐
                   │  3スクリプトが独自に      │
                   │  slug を取得している      │
                   └───────┬────────────────┘
                           │
              ┌────────────┼────────────────┐
              ▼            ▼                ▼
    generate.ts       thumbnail.ts      validate.ts
    (正規表現)        (frontmatter)     (frontmatter)
              │            │                │
              │    slug が空文字の場合       │
              │    ガードなし ──────► images/.png 生成
              │                             │
              │                     ファイル名不一致
              │                     ──────► 品質チェック全スキップ
              │
              └─────► 記事は正常に生成（slug 正規表現が成功）

    + Imagen API モデル廃止 ──────► サムネイル生成全件失敗
```

---

## 対策

| # | 対策 | ステータス | 変更ファイル |
|---|------|-----------|-------------|
| 1 | Claude API web_search ツール type を `web_search_20250305` に修正 | **完了**（commit `694272f`） | `src/providers/claude-provider.ts` |
| 2 | Imagen API モデル名を `imagen-4.0-generate-001` に更新。レスポンス形式を `generatedImages[].image.imageBytes` に変更 | **完了** | `src/scripts/thumbnail.ts` |
| 3 | slug 解決ロジックを `src/utils/slug.ts` に共通化（`resolveSlug`, `buildArticleFilename`） | **完了** | `src/utils/slug.ts`（新設）、`src/scripts/generate.ts`、`src/scripts/thumbnail.ts`、`src/scripts/validate.ts` |
| 4 | 空 slug バリデーションの追加（`validateSlug()`、generate/thumbnail にガード追加） | **完了** | `src/utils/slug.ts`、`src/scripts/generate.ts`、`src/scripts/thumbnail.ts` |
| 5 | テスト基盤（vitest）の導入とユニットテスト作成（15件） | **完了** | `vitest.config.ts`（新設）、`src/__tests__/slug.test.ts`（新設）、`src/__tests__/frontmatter.test.ts`（新設）、`src/__tests__/validate.test.ts`（新設）、`package.json` |
| 6 | 定数・設定の集約リファクタリング（`src/config/constants.ts` 新設） | **完了** | `src/config/constants.ts`（新設）、`src/scripts/generate.ts`、`src/scripts/thumbnail.ts`、`src/scripts/validate.ts`、`src/scripts/research.ts` |
| 7 | 不正ファイル（`images/.png`、テスト記事）の削除 | **完了** | `images/.png`（手動削除済み） |
| 8 | `generate.ts` の `draft: true` テストコード除去 | **完了** | `src/scripts/generate.ts` |

---

## 再発防止策

1. **slug 解決の一元化**: 全スクリプトが共通ユーティリティ経由で slug を取得する
2. **防御的バリデーション**: 空 slug / 不正形式の slug でパイプラインを早期中断する
3. **テストの追加**: slug 解決・frontmatter パース・バリデーションのユニットテスト
4. **API モデル名の定数化**: ハードコードを排除し、変更時の影響範囲を限定する

---

## 修正詳細

### 新設ファイル一覧

```
src/utils/slug.ts                  — slug 解決ユーティリティ（resolveSlug, buildArticleFilename, validateSlug）
src/config/constants.ts            — 共通定数（CATEGORIES, ARTICLES_DIR, IMAGES_DIR, TMP_DIR, IMAGEN_MODEL, DEFAULT_IMAGE_PATH）
src/__tests__/slug.test.ts         — slug ユーティリティのユニットテスト（9件）
src/__tests__/frontmatter.test.ts  — frontmatter ユーティリティのユニットテスト（4件）
src/__tests__/validate.test.ts     — validateArticle 関数のユニットテスト（2件）
vitest.config.ts                   — Vitest 設定ファイル
```

### 主要な変更内容

#### src/scripts/thumbnail.ts
- Imagen API モデル: `imagen-3.0-generate-002` → `imagen-4.0-generate-001`（`IMAGEN_MODEL` 定数参照）
- レスポンスパース: `predictions[].bytesBase64Encoded` → `generatedImages[].image.imageBytes`
- `resolveSlug()` による slug 解決に統一
- 空/不正 slug の場合は `continue` でスキップ

#### src/scripts/generate.ts
- 正規表現による slug 抽出を `resolveSlug()` に置換
- `validateSlug()` によるガード追加
- `processResearchResult(result, category, today)` 純粋関数を抽出・export（ファイルI/Oは `main()` に残す）
- ハードコード文字列を定数参照に置換

#### src/scripts/validate.ts
- `resolveSlug()` + `buildArticleFilename()` による slug/パス解決に統一
- ハードコード文字列を定数参照に置換

#### src/scripts/research.ts
- ハードコード文字列を定数参照に置換

### 最終品質ゲート結果

| ゲート | 結果 |
|--------|------|
| `npm run test` | 15/15 PASS |
| `npx tsc --noEmit` | 0 errors |
| slug 一貫性（resolveSlug 共通使用） | PASS |
| 不正ファイル排除（`images/.png` 不存在） | PASS |
| `draft: true` コード除去 | PASS |

---

## タイムライン

| 時刻 (UTC) | イベント |
|------------|---------|
| 12:38 | 1回目のワークフロー手動トリガー（Claude プロバイダー） |
| 12:39 | research.ts が両カテゴリで ERROR を返す |
| 12:39 | generate/thumbnail/validate が全スキップ。ワークフローは「成功」で完了 |
| 12:40 | Claude API web_search ツール定義の問題を特定。`claude-provider.ts` を修正 |
| 12:41 | research.ts にエラー詳細ログを追加。修正を push（commit `694272f`） |
| 12:41 | 2回目のワークフロー手動トリガー |
| 12:42 | paper-review: OK, ai-news-digest: OK（research 成功） |
| 12:42 | サムネイル生成: Imagen API 404。フォールバックで `images/.png` 生成 |
| 12:42 | validate: ファイル名不一致で全スキップ |
| 12:42 | commit & push 成功（不正ファイル含む） |
| 12:42 | デプロイトリガー成功 |
