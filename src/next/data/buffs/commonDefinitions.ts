import type { OperatorBuffDefinitions } from '../../core/game-data/operatorDefinition';
import { commonBuffDefinitions as ardeliaCommonBuffDefinitions } from '../operators/generated-definitions/ardelia/ardelia.operator.generated';
import { commonBuffDefinitions as camilleCommonBuffDefinitions } from '../operators/generated-definitions/camille/camille.operator.generated';
import { commonBuffDefinitions as gilbertaCommonBuffDefinitions } from '../operators/generated-definitions/gilberta/gilberta.operator.generated';
import { commonBuffDefinitions as lastRiteCommonBuffDefinitions } from '../operators/generated-definitions/last-rite/last-rite.operator.generated';
import { commonBuffDefinitions as rossiCommonBuffDefinitions } from '../operators/generated-definitions/rossi/rossi.operator.generated';
import { commonBuffDefinitions as snowshineCommonBuffDefinitions } from '../operators/generated-definitions/snowshine/snowshine.operator.generated';
import { commonBuffDefinitions as tangtangCommonBuffDefinitions } from '../operators/generated-definitions/tangtang/tangtang.operator.generated';
import { commonBuffDefinitions as avywennaCommonBuffDefinitions } from '../operators/generated-definitions/avywenna/avywenna.operator.generated';
import { commonBuffDefinitions as akekuriCommonBuffDefinitions } from '../operators/generated-definitions/akekuri/akekuri.operator.generated';
import { commonBuffDefinitions as yvonneCommonBuffDefinitions } from '../operators/generated-definitions/yvonne/yvonne.operator.generated';
import { commonBuffDefinitions as xaihiCommonBuffDefinitions } from '../operators/generated-definitions/xaihi/xaihi.operator.generated';
import { commonBuffDefinitions as wulfgardCommonBuffDefinitions } from '../operators/generated-definitions/wulfgard/wulfgard.operator.generated';
import { commonBuffDefinitions as emberCommonBuffDefinitions } from '../operators/generated-definitions/ember/ember.operator.generated';
import { commonBuffDefinitions as daPanCommonBuffDefinitions } from '../operators/generated-definitions/da-pan/da-pan.operator.generated';
import { commonBuffDefinitions as antalCommonBuffDefinitions } from '../operators/generated-definitions/antal/antal.operator.generated';
import { commonBuffDefinitions as estellaCommonBuffDefinitions } from '../operators/generated-definitions/estella/estella.operator.generated';
import { commonBuffDefinitions as fluoriteCommonBuffDefinitions } from '../operators/generated-definitions/fluorite/fluorite.operator.generated';
import { commonBuffDefinitions as arclightCommonBuffDefinitions } from '../operators/generated-definitions/arclight/arclight.operator.generated';
import { commonBuffDefinitions as chenQianyuCommonBuffDefinitions } from '../operators/generated-definitions/chen-qianyu/chen-qianyu.operator.generated';
import { commonBuffDefinitions as perlicaCommonBuffDefinitions } from '../operators/generated-definitions/perlica/perlica.operator.generated';
import { commonBuffDefinitions as liinoCommonBuffDefinitions } from '../operators/generated-definitions/liino/liino.operator.generated';
import { commonBuffDefinitions as endministratorCommonBuffDefinitions } from '../operators/generated-definitions/endministrator/endministrator.operator.generated';
import { commonBuffDefinitions as lifengCommonBuffDefinitions } from '../operators/generated-definitions/lifeng/lifeng.operator.generated';
import { commonBuffDefinitions as mifuCommonBuffDefinitions } from '../operators/generated-definitions/mifu/mifu.operator.generated';
import { commonBuffDefinitions as laevatainCommonBuffDefinitions } from '../operators/generated-definitions/laevatain/laevatain.operator.generated';
import { commonBuffDefinitions as aleshCommonBuffDefinitions } from '../operators/generated-definitions/alesh/alesh.operator.generated';
import { commonBuffDefinitions as pogranichnikCommonBuffDefinitions } from '../operators/generated-definitions/pogranichnik/pogranichnik.operator.generated';
import { commonBuffDefinitions as zhuangFangyiCommonBuffDefinitions } from '../operators/generated-definitions/zhuang-fangyi/zhuang-fangyi.operator.generated';
import { commonBuffDefinitions as catcherCommonBuffDefinitions } from '../operators/generated-definitions/catcher/catcher.operator.generated';
import { commonBuffDefinitions as arcaneCommonBuffDefinitions } from '../operators/generated-definitions/arcane/arcane.operator.generated';

/**
 * 公共 Buff 使用统一编译器的正式干员产物聚合。
 * 这是全局只读目录，不是将公共 Buff 放进某个干员的可编辑定义。
 */
export const commonBuffDefinitions: OperatorBuffDefinitions = Object.freeze({
  // 先纳入其余正式干员的唯一公共定义；下方既有审核顺序继续决定共享 ID 的规范版本。
  ...ardeliaCommonBuffDefinitions,
  ...camilleCommonBuffDefinitions,
  ...gilbertaCommonBuffDefinitions,
  ...lastRiteCommonBuffDefinitions,
  ...rossiCommonBuffDefinitions,
  ...snowshineCommonBuffDefinitions,
  ...tangtangCommonBuffDefinitions,
  ...avywennaCommonBuffDefinitions,
  ...akekuriCommonBuffDefinitions,
  ...yvonneCommonBuffDefinitions,
  ...xaihiCommonBuffDefinitions,
  ...wulfgardCommonBuffDefinitions,
  ...emberCommonBuffDefinitions,
  ...daPanCommonBuffDefinitions,
  ...antalCommonBuffDefinitions,
  ...estellaCommonBuffDefinitions,
  ...fluoriteCommonBuffDefinitions,
  ...arclightCommonBuffDefinitions,
  ...chenQianyuCommonBuffDefinitions,
  ...perlicaCommonBuffDefinitions,
  ...liinoCommonBuffDefinitions,
  ...endministratorCommonBuffDefinitions,
  ...lifengCommonBuffDefinitions,
  ...mifuCommonBuffDefinitions,
  ...laevatainCommonBuffDefinitions,
  ...aleshCommonBuffDefinitions,
  ...pogranichnikCommonBuffDefinitions,
  ...zhuangFangyiCommonBuffDefinitions,
  ...catcherCommonBuffDefinitions,
  ...arcaneCommonBuffDefinitions,
});
