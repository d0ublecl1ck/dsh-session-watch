/**
 * `unarchived-watch` dictionaries. Simplified Chinese is the source of truth
 * for the key set; English mirrors it one-to-one.
 *
 * @module dsh-unarchived-watch/client/locales
 */

/** Simplified Chinese dictionary. */
export const zh = {
  'badge.aria': '未归档会话 {count} 个，已超过阈值 {threshold} 个',
  'row.title': '未归档会话提醒',
  'row.description': '未归档会话超过该数量时，在侧边栏底部显示警告图标。当前 {count} 个未归档，阈值 {threshold} 个。',
  'row.inputLabel': '未归档会话阈值',
  'row.saveFailed': '保存失败，请重试',
}

/** English dictionary; the key set is fixed by the Chinese source of truth. */
export const en: Record<keyof typeof zh, string> = {
  'badge.aria': '{count} unarchived sessions, above the threshold of {threshold}',
  'row.title': 'Unarchived session warning',
  'row.description':
    'Show a warning icon at the sidebar foot once unarchived sessions exceed this number. Currently {count} unarchived, threshold {threshold}.',
  'row.inputLabel': 'Unarchived session threshold',
  'row.saveFailed': 'Could not save; try again',
}
