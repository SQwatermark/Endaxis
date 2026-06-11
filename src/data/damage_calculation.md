Damage calculation formula: https://endfield.wiki.gg/wiki/Damage_calculation
Most important rule: all hits before any effect

- Hit damage is always calculated before any effect is applied/consumed in the same time frame t. Meaning if a hit applied dmgBonus, it won't benefit from it. If a hit consumes dmgBonus, it will still benefit from it.

Hit multiplier: determined by HitGroup multiplier (with multiplierScaling) and multiplierMode.
resistanceIgnore and resistanceShred adds up for Resistance Multiplier.
Protection, weaken are excluded from damage calculation (they reduce enemy damage).
Link bonus are recored inside ResolvedHit.consumedStacks.
There are "local" stat effects needs to be applied to damage in ResolvedHit.consumedStatEffects.
Basic Attack includes final strike but not in reverse.

Verify: I want to see expected damage (crit-biased) of hits (diamonds) in timeline as their title. Current hit title content (time, stagger) can be removed.

Any questions?
