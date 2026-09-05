import { describe, expect, it } from 'vitest';

import { readGameIconReferences } from '../src/compiler/gameIconReferences.ts';

describe('game icon reference closure', () => {
  it('includes generated enemy icons without accepting unrelated webp strings', () => {
    expect(
      readGameIconReferences(`
        const enemy = '/Icon_Enemy/eny_0127_bigents.webp';
        const equipment = '/equipment/foo.webp';
        const contract = '/contingency_contract/1/icon_activity_contract_tag_111_2.webp';
        const unrelated = '/screenshots/example.webp';
      `),
    ).toEqual([
      '/Icon_Enemy/eny_0127_bigents.webp',
      '/contingency_contract/1/icon_activity_contract_tag_111_2.webp',
      '/equipment/foo.webp',
    ]);
  });
});
