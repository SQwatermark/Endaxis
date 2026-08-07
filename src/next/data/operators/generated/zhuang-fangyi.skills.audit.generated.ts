/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { percentages, scheduled, sequence, step } from '../definitionHelpers';

// prettier-ignore
export const zhuangFangyiGeneratedSkills = [
  {
    key: 'basicAttack1',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }),
        ),
      ),
    ],
  },
  {
    key: 'basicAttack2',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }),
        ),
      ),
    ],
  },
  {
    key: 'basicAttack3',
    timelineBlockFrames: 26,
    scheduledSequences: [
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }),
        ),
      ),
    ],
  },
  {
    key: 'basicAttack4',
    timelineBlockFrames: 17,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([11, 12, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        20,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([11, 12, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25]),
            tags: ['normalAttack'],
          }),
        ),
      ),
    ],
  },
  {
    key: 'basicAttack5',
    timelineBlockFrames: 50,
    scheduledSequences: [
      scheduled(
        20,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([48, 53, 58, 62, 67, 72, 77, 82, 86, 92, 100, 108]),
            tags: ['normalAttack'],
            stagger: 18,
          }),
        ),
      ),
    ],
  },
  {
    key: 'enhancedBasicAttack1',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([67, 73, 80, 86, 93, 100, 106, 113, 120, 128, 138, 150]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([67, 73, 80, 86, 93, 100, 106, 113, 120, 128, 138, 150]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([67, 73, 80, 86, 93, 100, 106, 113, 120, 128, 138, 150]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([67, 73, 80, 86, 93, 100, 106, 113, 120, 128, 138, 150]),
            tags: ['normalAttack'],
          }),
        ),
      ),
    ],
  },
  {
    key: 'enhancedBasicAttack2',
    timelineBlockFrames: 27,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([94, 103, 112, 122, 131, 140, 150, 159, 168, 180, 194, 210]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([94, 103, 112, 122, 131, 140, 150, 159, 168, 180, 194, 210]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([94, 103, 112, 122, 131, 140, 150, 159, 168, 180, 194, 210]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([94, 103, 112, 122, 131, 140, 150, 159, 168, 180, 194, 210]),
            tags: ['normalAttack'],
          }),
        ),
      ),
    ],
  },
  {
    key: 'plungingAttack',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }),
        ),
      ),
    ],
  },
] as const satisfies readonly SkillDefinition[];
