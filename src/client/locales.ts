/**
 * session-watch dictionaries. Simplified Chinese is the source of truth for the
 * key set; English mirrors it one-to-one.
 *
 * @module dsh-session-watch/client/locales
 */

/** Simplified Chinese dictionary. */
export const zh = {
  'metric.running': '运行中',
  'metric.unread': '未读',
  'metric.pending': '待处理',
  'metric.idle': '闲置',
  'metric.unarchived': '未归档',
  'metric.archived': '已归档',
  'watch.aria': '会话状态：{summary}',
  'watch.summaryItem': '{label} {count} 个',
  'watch.summaryJoin': '，',
  'watch.railHint': '会话状态 · {unarchived} 个未归档',
  'watch.warn': '未归档 {count} 个，已超过阈值 {threshold} 个',
  'watch.empty': '没有要显示的计数项',
  'row.title': 'Session Watch 状态显示',
  'row.description': '侧边栏底部显示哪些会话计数。当前：{summary}',
  'row.showLabel': '显示项目',
  'row.variantLabel': '版式',
  'row.variant.chips': '胶囊',
  'row.variant.meter': '比例条',
  'row.thresholdLabel': '未归档告警阈值',
  'row.thresholdHint': '未归档超过该数量时，未归档计数进入告警色。',
  'row.inputLabel': '未归档会话阈值',
  'row.saveFailed': '保存失败，请重试',
}

/** English dictionary; the key set is fixed by the Chinese source of truth. */
export const en: Record<keyof typeof zh, string> = {
  'metric.running': 'Running',
  'metric.unread': 'Unread',
  'metric.pending': 'Pending',
  'metric.idle': 'Idle',
  'metric.unarchived': 'Unarchived',
  'metric.archived': 'Archived',
  'watch.aria': 'Session status: {summary}',
  'watch.summaryItem': '{label} {count}',
  'watch.summaryJoin': ', ',
  'watch.railHint': 'Session status · {unarchived} unarchived',
  'watch.warn': 'Unarchived {count}, above the threshold of {threshold}',
  'watch.empty': 'No metric is shown',
  'row.title': 'Session Watch readout',
  'row.description': 'Choose which Session counts the sidebar foot shows. Currently: {summary}',
  'row.showLabel': 'Shown metrics',
  'row.variantLabel': 'Layout',
  'row.variant.chips': 'Chips',
  'row.variant.meter': 'Meter',
  'row.thresholdLabel': 'Unarchived warning threshold',
  'row.thresholdHint': 'The unarchived count turns warning-coloured above this number.',
  'row.inputLabel': 'Unarchived session threshold',
  'row.saveFailed': 'Could not save; try again',
}
