/**
 * タグの日本語→英語フォールバック変換
 * LLM がタグを翻訳しなかった場合のセーフティネット。
 * translate.ts, validate.ts 等から共通利用する。
 */

/** 日本語文字（ひらがな・カタカナ・CJK漢字・全角記号）を含むかチェック */
export function containsJapanese(text: string): boolean {
  return /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]/.test(text);
}

/** よく使われる日本語タグ → 英語のフォールバックマッピング */
export const TAG_FALLBACK_MAP: Record<string, string> = {
  // 一般
  'ニュース': 'News',
  'テクノロジー': 'Technology',
  'コミュニティ': 'Community',
  '戦略': 'Strategy',
  '倫理': 'Ethics',
  '規制': 'Regulation',
  '半導体': 'Semiconductors',

  // AI 関連
  'AI安全': 'AI Safety',
  'AI安全性': 'AI Safety',
  'AIエージェント': 'AI Agents',
  'エージェントAI': 'Agent AI',
  'AI開発': 'AI Development',
  'AI競争': 'AI Competition',
  'AIインフラ': 'AI Infrastructure',
  '生成AI': 'Generative AI',

  // ML / NLP
  '機械学習': 'Machine Learning',
  '深層学習': 'Deep Learning',
  '強化学習': 'Reinforcement Learning',
  '自然言語処理': 'Natural Language Processing',
  '推論': 'Reasoning',
  'マルチエージェント': 'Multi-agent',
  'マルチモーダル': 'Multimodal',

  // 技術用語
  '仕様書': 'Specifications',
  'コンテキストエンジニアリング': 'Context Engineering',
  'モデルリリース': 'Model Release',
  '開発者体験': 'Developer Experience',
  'ロボティクス': 'Robotics',

  // ビジネス・政策
  '企業動向': 'Corporate Trends',
  '政策・規制/安全性': 'Policy/Regulation/Safety',
  '経済政策': 'Economic Policy',
  '国防総省': 'Department of Defense',

  // 科学
  '科学発見': 'Scientific Discovery',
  '気候科学': 'Climate Science',
  '生命科学': 'Life Sciences',
  '教育技術': 'Educational Technology',

  // 中国語で残る可能性のあるもの
  '推理': 'Reasoning',
  '多智能体': 'Multi-agent',
  '機器人': 'Robotics',
};

/**
 * タグ配列から日本語タグを英語に変換する。
 * フォールバックマッピングにないタグは WARNING ログを出力し、そのまま返す。
 */
export function sanitizeTagsForLocale(tags: string[], locale: string): string[] {
  if (locale === 'ja') return tags;

  return tags.map((tag) => {
    if (containsJapanese(tag)) {
      const fallback = TAG_FALLBACK_MAP[tag];
      if (fallback) {
        console.log(`  [${locale}] Tag fallback: "${tag}" → "${fallback}"`);
        return fallback;
      }
      console.warn(`  [${locale}] WARNING: Japanese tag not in fallback map: "${tag}"`);
      return tag;
    }
    return tag;
  });
}
