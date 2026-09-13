import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { ALL_GAME_TEXT_FAMILIES, ensureLocaleResources, i18n } from '../i18n';
import type { GameTextFamily } from '../i18n/localeResourceLoaders';
import { loadTemporaryLegacyPreviewProject } from './temporaryLegacyPreviewProjects';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/timeline' },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('../ui/timeline/TimelineEditor.vue'),
    meta: {
      gameTextFamilies: ALL_GAME_TEXT_FAMILIES,
    },
  },
  {
    path: '/timeline/preview/:legacyShareId',
    name: 'TemporaryLegacyTimelinePreview',
    component: () => import('../ui/timeline/TimelineEditor.vue'),
    props: route => ({ initialProject: route.meta.temporaryLegacyPreviewProject }),
    beforeEnter: async to => {
      to.meta.temporaryLegacyPreviewProject = await loadTemporaryLegacyPreviewProject(
        String(to.params.legacyShareId),
      );
    },
    meta: {
      gameTextFamilies: ALL_GAME_TEXT_FAMILIES,
    },
  },
  {
    path: '/editor-demo',
    name: 'EditorDemo',
    component: () => import('../ui/editor-demo/OperatorEditorWorkspaceDemo.vue'),
    meta: {
      gameTextFamilies: ['operators'] satisfies readonly GameTextFamily[],
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
