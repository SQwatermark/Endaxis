import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { ALL_GAME_TEXT_FAMILIES, ensureLocaleResources, i18n } from '../i18n';
import type { GameTextFamily } from '../i18n/localeResourceLoaders';
import { loadTemporaryLegacyPreviewProject } from './temporaryLegacyPreviewProjects';
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
  };
};

async function prepareTimelineRoute(
  to: { meta: Record<PropertyKey, unknown> },
  project: unknown,
): Promise<void> {
  to.meta.timelineInitialProject = project;
  to.meta.timelineGameDataRepository = await createProjectGameDataRepository(project);
}

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/timeline' },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('../ui/timeline/TimelineEditor.vue'),
    props: timelineRouteProps,
    beforeEnter: async to => prepareTimelineRoute(to, undefined),
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
