import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { ALL_GAME_TEXT_FAMILIES, ensureLocaleResources, i18n } from '../i18n';
import type { GameTextFamily } from '../i18n/localeResourceLoaders';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/timeline' },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('../views/TimelineEntry.vue'),
    meta: {
      requiresLegacyTimeline: true,
      gameTextFamilies: ALL_GAME_TEXT_FAMILIES,
    },
  },
  {
    path: '/next/timeline',
    name: 'NextTimeline',
    component: () => import('../next/ui/timeline/NextTimelineEditor.vue'),
    meta: { gameTextFamilies: ['operators', 'weapons'] satisfies readonly GameTextFamily[] },
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
