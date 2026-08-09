/**
 * 将时间轴编辑器支持的按键组合映射为命令，不读取项目、选择或 DOM 状态。
 * 焦点和浮层作用域由外层快捷键路由器判断；这里仅保证组合键语义可独立测试和扩展。
 */
export interface TimelineKeyboardCommands {
  readonly undo: () => boolean;
  readonly redo: () => boolean;
  readonly copy: () => boolean;
  readonly paste: () => boolean;
  readonly delete: () => boolean;
  readonly nudgeLeft: () => boolean;
  readonly nudgeRight: () => boolean;
  readonly toggleSnapPrecision: () => boolean;
}

export function handleTimelineEditorShortcut(
  event: KeyboardEvent,
  commands: TimelineKeyboardCommands,
): boolean {
  const key = event.key.toLowerCase();
  if (event.altKey) {
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && key === 's') {
      return commands.toggleSnapPrecision();
    }
    return false;
  }
  if (event.ctrlKey || event.metaKey) {
    if (key === 'z') return event.shiftKey ? commands.redo() : commands.undo();
    if (key === 'y' && !event.shiftKey) return commands.redo();
    if (!event.shiftKey && key === 'c') return commands.copy();
    if (!event.shiftKey && key === 'v') return commands.paste();
    return false;
  }
  if (event.shiftKey) return false;
  if (key === 'delete' || key === 'backspace') return commands.delete();
  if (key === 'arrowleft' || key === 'a') return commands.nudgeLeft();
  if (key === 'arrowright' || key === 'd') return commands.nudgeRight();
  return false;
}
