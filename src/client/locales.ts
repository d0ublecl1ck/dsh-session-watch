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
  'section.nav': '未归档会话',
  'section.title': '未归档会话',
  'section.summary': '当前 {count} 个未归档普通会话，阈值为 {threshold} 个。',
  'section.over': '已超过阈值，侧边栏底部会亮起警告图标。',
  'section.under': '未超过阈值，侧边栏不亮灯。',
  'section.rule': '口径：只数普通会话 —— 已归档、子代理子会话与空白新建会话都不计入。',
  'section.empty': '没有未归档的普通会话。',
  'section.ungrouped': '未归属工作区',
  'section.running': '运行中',
  'section.age.minute': '{count} 分钟前',
  'section.age.hour': '{count} 小时前',
  'section.age.day': '{count} 天前',
  'section.count': '{count} 个',
}

/** English dictionary; the key set is fixed by the Chinese source of truth. */
export const en: Record<keyof typeof zh, string> = {
  'badge.aria': '{count} unarchived sessions, above the threshold of {threshold}',
  'row.title': 'Unarchived session warning',
  'row.description':
    'Show a warning icon at the sidebar foot once unarchived sessions exceed this number. Currently {count} unarchived, threshold {threshold}.',
  'row.inputLabel': 'Unarchived session threshold',
  'row.saveFailed': 'Could not save; try again',
  'section.nav': 'Unarchived sessions',
  'section.title': 'Unarchived sessions',
  'section.summary': '{count} unarchived ordinary sessions right now, threshold {threshold}.',
  'section.over': 'Past the threshold: the sidebar foot shows the warning icon.',
  'section.under': 'Below the threshold: the sidebar stays dark.',
  'section.rule': 'Scope: ordinary sessions only — archived, subagent, and blank sessions are not counted.',
  'section.empty': 'No unarchived ordinary sessions.',
  'section.ungrouped': 'No workspace',
  'section.running': 'Running',
  'section.age.minute': '{count} min ago',
  'section.age.hour': '{count} h ago',
  'section.age.day': '{count} d ago',
  'section.count': '{count}',
}
