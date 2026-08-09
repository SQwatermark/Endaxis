/**
 * Next UI 对旧版富文本渲染器和共用弹窗样式的集中适配。
 *
 * 本模块只桥接视觉资源，不读取旧 Store 或业务数据。未来 Next 拥有原生主题与富文本组件时，
 * 可替换这里的导出及样式入口，使用方无需继续保留跨目录的旧版依赖。
 */
import GameRichTextRenderer from '@/components/GameRichTextRenderer.vue';
import '@/components/armory/armoryDialogTheme.css';
import '@/components/selection/selectionDialog.css';

export { GameRichTextRenderer };
