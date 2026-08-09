import { onScopeDispose } from 'vue';

/**
 * 页面级快捷键作用域。优先级较高的活动作用域先获得按键，处理后不会继续穿透。
 * 弹窗、菜单和编辑器可分别注册作用域，避免在组件中散落 window 监听器。
 */
export interface KeyboardShortcutScope {
  readonly id: string;
  readonly priority: number;
  readonly active: () => boolean;
  readonly handle: (event: KeyboardEvent) => boolean;
  /** 当前作用域未处理该键时，是否仍阻止更低层页面快捷键接管。 */
  readonly blockLowerScopes?: boolean;
}

interface RegisteredKeyboardShortcutScope extends KeyboardShortcutScope {
  readonly order: number;
}

/** 文本编辑控件应保留浏览器原生复制、粘贴和光标操作。 */
export function isTextEditingTarget(target: EventTarget | null): boolean {
  if (typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.closest('input, textarea, select, [contenteditable="true"]') !== null
  );
}

export class KeyboardShortcutRouter {
  readonly #scopes = new Map<string, RegisteredKeyboardShortcutScope>();
  #nextOrder = 0;

  register(scope: KeyboardShortcutScope): () => void {
    const registered = { ...scope, order: this.#nextOrder++ };
    this.#scopes.set(scope.id, registered);
    return () => {
      if (this.#scopes.get(scope.id) === registered) this.#scopes.delete(scope.id);
    };
  }

  route(event: KeyboardEvent): boolean {
    const activeScopes = [...this.#scopes.values()]
      .filter(scope => scope.active())
      .sort((left, right) => right.priority - left.priority || right.order - left.order);

    for (const scope of activeScopes) {
      if (scope.handle(event)) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
      if (scope.blockLowerScopes) break;
    }
    return false;
  }
}

const pageKeyboardShortcutRouter = new KeyboardShortcutRouter();
let listening = false;
let pageScopeCount = 0;

function routePageKeyboardEvent(event: KeyboardEvent): void {
  pageKeyboardShortcutRouter.route(event);
}

function ensurePageListener(): void {
  if (listening || typeof window === 'undefined') return;
  window.addEventListener('keydown', routePageKeyboardEvent, true);
  listening = true;
}

/** 注册随 Vue 作用域自动释放的页面级快捷键作用域。 */
export function useKeyboardShortcutScope(scope: KeyboardShortcutScope): void {
  ensurePageListener();
  pageScopeCount += 1;
  const unregister = pageKeyboardShortcutRouter.register(scope);
  onScopeDispose(() => {
    unregister();
    pageScopeCount -= 1;
    if (pageScopeCount === 0 && listening && typeof window !== 'undefined') {
      window.removeEventListener('keydown', routePageKeyboardEvent, true);
      listening = false;
    }
  });
}
