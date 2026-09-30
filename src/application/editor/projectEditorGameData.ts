import {
  createProjectGameDataRepository,
  getProjectDefinitionLibrary,
  type ProjectGameData,
} from '../../core/project/projectDefinitionLibrary';
import type { ProjectEditorSession } from './projectEditorSession';

/**
 * 编辑会话拥有查询端口；模板保存、撤销和项目替换都更新同一个对象。
 * 应在创建场景会话和订阅界面之前绑定，让后续观察者读到新定义。
 */
export function bindProjectEditorGameData(base: ProjectGameData, session: ProjectEditorSession) {
  let library = getProjectDefinitionLibrary(session.snapshot.project);
  const repository = createProjectGameDataRepository(base, library);
  const dispose = session.subscribe(snapshot => {
    const nextLibrary = getProjectDefinitionLibrary(snapshot.project);
    if (nextLibrary === library) return;
    // 组合成功后才同步替换全部查询方法；普通对象写入不触发界面通知。
    Object.assign(repository, createProjectGameDataRepository(base, nextLibrary));
    library = nextLibrary;
  });
  return { repository, dispose };
}
