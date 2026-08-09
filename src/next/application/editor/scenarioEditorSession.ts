/**
 * 为场景编辑提供唯一的显式提交边界。
 * UI 只能通过 `commit` 替换场景文档；后续撤销、重做、自动保存和协作修订都应接在此处，
 * 不应通过深层 watcher 猜测一次用户操作何时结束。
 */
import type { ScenarioDocument } from '../../core/project/schema';

export interface ScenarioEditorSnapshot {
  /** 每次有效提交递增；它表示编辑会话修订，不写入项目文档。 */
  readonly revision: number;
  readonly scenario: ScenarioDocument;
  /** 最近一次有效提交的稳定操作名，供历史记录和调试使用。 */
  readonly lastCommand: string | null;
}

export type ScenarioCommand = (scenario: ScenarioDocument) => ScenarioDocument;
export type ScenarioEditorSubscriber = (snapshot: ScenarioEditorSnapshot) => void;

export class ScenarioEditorSession {
  #snapshot: ScenarioEditorSnapshot;
  readonly #subscribers = new Set<ScenarioEditorSubscriber>();

  constructor(initialScenario: ScenarioDocument) {
    this.#snapshot = {
      revision: 0,
      scenario: initialScenario,
      lastCommand: null,
    };
  }

  get snapshot(): ScenarioEditorSnapshot {
    return this.#snapshot;
  }

  /**
   * 提交一个返回新文档的场景命令。返回原引用表示没有产生修改，因此不会增加修订或通知订阅者。
   * 命令必须遵守不可变更新约定；会话不会通过深拷贝掩盖原地修改。
   */
  commit(commandName: string, command: ScenarioCommand): boolean {
    if (commandName.length === 0) throw new Error('scenario command name must not be empty');
    const nextScenario = command(this.#snapshot.scenario);
    if (nextScenario === this.#snapshot.scenario) return false;

    this.#snapshot = {
      revision: this.#snapshot.revision + 1,
      scenario: nextScenario,
      lastCommand: commandName,
    };
    for (const subscriber of this.#subscribers) subscriber(this.#snapshot);
    return true;
  }

  subscribe(subscriber: ScenarioEditorSubscriber): () => void {
    this.#subscribers.add(subscriber);
    return () => this.#subscribers.delete(subscriber);
  }
}
