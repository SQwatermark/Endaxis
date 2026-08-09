import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/timeline' },
  {
    path: '/timeline',
    name: 'Timeline',
    component: () => import('../views/TimelineEntry.vue'),
    meta: { requiresLegacyTimeline: true },
  },
  {
    path: '/next/timeline',
    name: 'NextTimeline',
    component: () => import('../next/ui/timeline/NextTimelineEditor.vue'),
  },
];

const router = createRouter({
  history:
    typeof window !== 'undefined' && window.location.hostname === 'appassets.androidplatform.net'
      ? createWebHashHistory('/')
      : createWebHistory('/'),
  routes,
});

export default router;
