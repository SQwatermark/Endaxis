/**
 * Parse Arknights Endfield game text tags into styled HTML.
 *
 * Supported tags:
 *   <@ba.xxx> … </> — attribute / keyword highlight
 *   <@ba.key>   — key binding name (gold)
 *   <@ba.vup>   — value up (green)
 *   <@ba.phy>   — physical damage (orange)
 *   <@ba.pulse> — electromagnetic / pulse (purple)
 *   <@ba.fire>  — fire damage (red)
 *   <@ba.cryst> — crystal / ice damage (cyan)
 *   <@ba.nature>— nature damage (green)
 *   <@ba.poise> — poise value (teal)
 *   <#ba.xxx>   — status keyword with icon
 *   <#ba.shield>— shield icon
 *   \\n          — line break
 */
export function parseGameText(text: string): string {
  if (!text) return ''

  const TAG_MAP: Record<string, string> = {
    'key':   'game-text-keyword',
    'vup':   'game-text-value-up',
    'phy':   'game-text-physical',
    'pulse': 'game-text-pulse',
    'fire':  'game-text-fire',
    'cryst': 'game-text-cryst',
    'nature':'game-text-nature',
    'poise': 'game-text-poise',
    'pd':    'game-text-physical',
    'lastcombo': 'game-text-keyword',
  }

  // Status tags with inline icon label
  const STATUS_TAGS: Record<string, string> = {
    'shield': '🛡',
    'knockdown': '⬇',
    'crystinflict': '❄',
  }

  let result = text
    .replace(/\\n/g, '<br>')

  // <@ba.xxx> → open span
  result = result.replace(/<@ba\.(\w+)>/g, (_, tag: string) => {
    const cls = TAG_MAP[tag] || 'game-text-keyword'
    return `<span class="${cls}">`
  })

  // <#ba.xxx> → open span with optional icon
  result = result.replace(/<#ba\.(\w+)>/g, (_, tag: string) => {
    const icon = STATUS_TAGS[tag] || ''
    return `<span class="game-text-status">${icon}`
  })

  // </> → close span
  result = result.replace(/<\/>/g, '</span>')

  // <image="..."/> → remove (not rendered)
  result = result.replace(/<image="[^"]*"\/>/g, '')

  return result
}
