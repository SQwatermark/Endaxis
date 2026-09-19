import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { ALL_GAME_TEXT_FAMILIES, ensureLocaleResources, i18n } from '../i18n';
import type { GameTextFamily } from '../i18n/localeResourceLoaders';
import { loadTemporaryLegacyPreviewProject } from './temporaryLegacyPreviewProjects';
import { loadBrowserProject } from '../data/browserProjectStorage';
import { openProject } from '../application/openProject';
import {
  createProjectGameDataRepository,
  type ProjectGameDataRepository,
} from '../data/projectGameDataRepository';

const timelineRouteProps = (route: { meta: Record<PropertyKey, unknown> }) => {
  const gameDataRepository = route.meta.timelineGameDataRepository as
    ProjectGameDataRepository | undefined;
  if (gameDataRepository === undefined) throw new Error('timeline game data was not prepared');
  return {
    initialProject: route.meta.timelineInitialProject,
    gameDataRepository,
    browserPersistenceEnabled: route.meta.timelineBrowserPersistenceEnabled === true,
    browserRestoreError: route.meta.timelineBrowserRestoreError,
  };
};

async function prepareTimelineRoute(
  to: { meta: Record<PropertyKey, unknown> },
  project: unknown,
): Promise<void> {
  to.meta.timelineInitialProject = project;
  to.meta.timelineGameDataRepository = await createProjectGameDataRepository(project);
}

async function prepareSavedTimelineRoute(to: {
  meta: Record<PropertyKey, unknown>;
}): Promise<void> {
  to.meta.timelineBrowserPersistenceEnabled = true;
  let saved: string | undefined;
  try {
    saved = await loadBrowserProject();
  } catch (error) {
    to.meta.timelineBrowserRestoreError =
      error instanceof Error ? error.message : '读取浏览器项目失败';
  }
  if (saved === undefined) {
    await prepareTimelineRoute(to, undefined);
    return;
  }
  let input: unknown;
  try {
    input = JSON.parse(saved) as unknown;
  } catch {
    to.meta.timelineBrowserRestoreError = '浏览器保存的项目不是有效的 JSON';
    await prepareTimelineRoute(to, undefined);
    return;
  }
  const gameDataRepository = await createProjectGameDataRepository(input);
  const result = openProject(input, { gameDataRepository });
  if (!result.ok) {
    to.meta.timelineBrowserRestoreError = '浏览器保存的项目无法通过校验，请重新导入项目文件';
    await prepareTimelineRoute(to, undefined);
    return;
  }
  to.meta.timelineInitialProject = result.project;
  to.meta.timelineGameDataRepository = gameDataRepository;
}

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/timeline' },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('../ui/timeline/TimelineEditor.vue'),
    props: timelineRouteProps,
    beforeEnter: prepareSavedTimelineRoute,
    meta: {
      gameTextFamilies: ALL_GAME_TEXT_FAMILIES,
    },
  },
  {
    path: '/timeline/preview/:legacyShareId',
    name: 'TemporaryLegacyTimelinePreview',
    component: () => import('../ui/timeline/TimelineEditor.vue'),
    props: timelineRouteProps,
    beforeEnter: async to => {
      const project = await loadTemporaryLegacyPreviewProject(String(to.params.legacyShareId));
      await prepareTimelineRoute(to, project);
    },
    meta: {
      gameTextFamilies: ALL_GAME_TEXT_FAMILIES,
    },
  },
];

const router = createRouter({
  history:
    typeof window !== 'undefined' && window.location.hostname === 'appassets.androidplatform.net'
      ? createWebHashHistory('/')
      : createWebHistory('/'),
  routes,
});

router.beforeEach(async to => {
  const families = (to.meta.gameTextFamilies ?? []) as readonly GameTextFamily[];
  await ensureLocaleResources(i18n.global.locale.value, families);
});

export default router;
