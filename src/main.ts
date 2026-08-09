import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import './styles/theme.css';
import './styles/ui.css';

import App from './App.vue';

import router from './router';
import { i18n, setLocale } from './i18n';
import { bootstrapAppearance } from './composables/useAppearance';

async function bootstrap() {
  bootstrapAppearance();
  // 首屏先加载 UI 文本；各路由在进入前声明自身需要的游戏文本 family。
  await setLocale(i18n.global.locale.value, []);

  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);
  app.use(ElementPlus);
  app.use(router);
  app.use(i18n);
  app.mount('#app');

  // 启动遮罩属于应用外壳；语言资源和首个路由完成挂载后再移除。
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById('boot-loader')?.remove();
    });
  });
}

void bootstrap();
