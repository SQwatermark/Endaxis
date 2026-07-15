"""
Export Endaxis operators.json from AKEDatabase TableCfg/ raw files.

Usage:
    python3 export_operators.py /path/to/AKEDatabase/public/TableCfg /path/to/Endaxis/src/i18n/game-locales/
Output: operators_zh.json, operators_en.json
"""

import json
import os
import sys
import re

TEXT_TABLE = {}

def load_text_table(table_dir, locale):
    """Load I18nTextTable_{locale}.json into a global lookup dict."""
    global TEXT_TABLE
    path = os.path.join(table_dir, f'I18nTextTable_{locale}.json')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            TEXT_TABLE = json.load(f)

def resolve_text(obj):
    """Resolve {id: ..., text: ...} or plain string. Falls back to I18nTextTable."""
    if obj is None:
        return ''
    if isinstance(obj, str):
        return obj
    if isinstance(obj, dict):
        text = obj.get('text', '')
        if text:
            return text
        # Try text ID
        tid = obj.get('id', 0)
        if tid:
            global TEXT_TABLE
            val = TEXT_TABLE.get(str(tid), '')
            if val:
                return val
    return ''

def strip_tags(text):
    """Remove <@...> <#...> </> <image=.../> tags for clean description."""
    text = re.sub(r'<@[^>]+>|</>|<#[^>]+>|<image=[^>]+/>', '', text)
    return text


def replace_placeholders(desc, values):
    """Replace {expr:format} with resolved values from blackboard.
    
    Format suffixes: :0 = integer, :.1/.2 = decimal places, :% = percentage x100.
    Expressions support simple math: {poise + atk:0}, {a * b:.1} etc.
    """
    if not desc or not isinstance(desc, str):
        return desc
    
    # Build lowercase lookup
    lower_values = {k.lower(): v for k, v in values.items()}
    
    def replacer(match):
        inner = match.group(1)
        parts = inner.split(':')
        expr = parts[0].strip()
        fmt = parts[1].strip() if len(parts) > 1 else ''
        
        # Find all variable names in expression
        var_names = re.findall(r'[a-zA-Z_][a-zA-Z0-9_]*', expr)
        if not var_names:
            return match.group(0)
        
        # Check all vars exist
        for name in var_names:
            if name.lower() not in lower_values:
                return match.group(0)
        
        # Build evaluable expression
        eval_expr = expr
        for name in var_names:
            value = lower_values[name.lower()]
            eval_expr = re.sub(r'\b' + re.escape(name) + r'\b', str(value), eval_expr)
        
        try:
            result = eval(eval_expr, {'__builtins__': {}}, {})
        except Exception:
            return match.group(0)
        
        # Format
        if fmt == '0%':
            return f'{round(result * 100)}%'
        elif re.match(r'^(0\.\d+)%$', fmt):
            # 0.0%, 0.00% — preserve precision
            precision = len(fmt.split('.')[1]) - 1  # strip the %
            return f'{result * 100:.{precision}f}%'
        elif fmt.endswith('%'):
            return f'{result * 100:.1f}%'
        elif fmt == '0':
            return str(round(result))
        elif re.match(r'^0\.\d+$', fmt):
            # 0.0, 0.00 — keep trailing zeros
            precision = len(fmt) - 2
            return f'{result:.{precision}f}'
        elif fmt.startswith('.'):
            precision = len(fmt) - 1
            result = round(result, precision)
            # Strip trailing zeros
            s = f'{result:.{precision}f}'.rstrip('0').rstrip('.')
            return s if s else '0'
        return str(result)
    
    return re.sub(r'\{([^}]+)\}', replacer, desc)
    

def build_value_map(effect_table, eid, attr_en_map=None, param_type_map=None):
    """Extract blackboard values from an effect's dataList.
    Uses ATTR_MAP_EN for attrModifier attribute names."""
    values = {}
    effect = effect_table.get(eid, {})
    for item in effect.get('dataList', []):
        for bb in item.get('attachBuff', {}).get('blackboard', []):
            if bb and bb.get('key'):
                values[bb['key']] = bb.get('value', 0)
        for bb in item.get('attachSkill', {}).get('blackboard', []):
            if bb and bb.get('key'):
                values[bb['key']] = bb.get('value', 0)
        mod = item.get('skillBbModifier', {})
        if mod.get('bbKey'):
            values[mod['bbKey']] = mod.get('floatValue', 0)
        mod2 = item.get('attrModifier', {})
        at = mod2.get('attrType')
        if at is not None and at > 0 and attr_en_map:
            name = attr_en_map.get(str(at), '')
            if name:
                values[name] = mod2.get('attrValue', 0)
        mod3 = item.get('skillParamModifier', {})
        pt = mod3.get('paramType')
        if pt is not None and param_type_map:
            name = param_type_map.get(str(pt), '')
            if name:
                values[name] = mod3.get('paramValue', 0)
    return values


def export_operators(table_dir, locale='CN', old_slugs=None):
    load_text_table(table_dir, locale)

    # Load all tables
    char_table = load_json(os.path.join(table_dir, 'CharacterTable.json'))
    pot_table = load_json(os.path.join(table_dir, 'CharacterPotentialTable.json'))
    effect_table = load_json(os.path.join(table_dir, 'PotentialTalentEffectTable.json'))
    grow_table = load_json(os.path.join(table_dir, 'CharGrowthTable.json'))
    skill_patch = load_json(os.path.join(table_dir, 'SkillPatchTable.json'))

    # Load EN table for slug generation
    en_text_path = os.path.join(table_dir, 'I18nTextTable_EN.json')
    en_text = {}
    if os.path.exists(en_text_path):
        with open(en_text_path, 'r', encoding='utf-8') as f:
            en_text = json.load(f)

    def en_resolve_text(obj):
        if obj is None: return ''
        if isinstance(obj, str): return obj
        if isinstance(obj, dict):
            text = obj.get('text', '')
            if text: return text
            tid = obj.get('id', 0)
            if tid: return en_text.get(str(tid), '')
        return ''

    # Load maps for attr names
    maps_path = os.path.join(os.path.dirname(table_dir), 'CH', 'maps.json')
    attr_en_map = {}
    param_type_map = {}
    if os.path.exists(maps_path):
        with open(maps_path, 'r', encoding='utf-8') as f:
            maps_data = json.load(f)
            attr_en_map = maps_data.get('ATTR_MAP_EN', {})
            param_type_map = maps_data.get('param_type_map', {})

    operators = {}

    for char_id, char_data in sorted(char_table.items()):
        if not char_id.startswith('chr_'):
            continue

        # slug: chr_0028_wulfa → English name -> slugified
        en_name = en_resolve_text(char_data.get('name', ''))
        slug = re.sub(r'\s+', '-', en_name.lower()) if en_name else ''
        slug = re.sub(r'[^a-z0-9-]', '', slug).strip('-')
        if not slug:
            # Fallback to internal id suffix
            parts = char_id.split('_')
            slug = parts[2] if len(parts) >= 3 else char_id
        # Use old slug if we have one (e.g. mi-fu → mifu, etc.)
        if old_slugs and slug not in old_slugs:
            undashed = slug.replace('-', '')
            if undashed in old_slugs:
                slug = undashed
        
        # Manual slug overrides: generated slug → our internal slug
        slug_overrides = {
            'mi-fu': 'mifu',  # "Mi Fu"
        }
        slug = slug_overrides.get(slug, slug)

        # ── name ──
        name = resolve_text(char_data.get('name', ''))
        if not name:
            name = slug

        # ── talents ──
        talents = []
        growth = grow_table.get(char_id, {})
        talent_nodes = growth.get('talentNodeMap', {})
        talent_items = []
        for _, node in talent_nodes.items():
            if node.get('nodeType') != 4:
                continue
            info = node.get('passiveSkillNodeInfo', {})
            eid = info.get('talentEffectId')
            if not eid:
                continue
            talent_items.append((info.get('index', 0), info.get('level', 0), info, eid))
        talent_items.sort(key=lambda x: (x[0], x[1]))

        for _, _, info, eid in talent_items:
            effect = effect_table.get(eid, {})
            desc = resolve_text(effect.get('desc', ''))
            # Fallback: use skill patch description
            if not desc:
                patch = skill_patch.get(eid, {})
                bundles = patch.get('SkillPatchDataBundle', [])
                if bundles:
                    desc = resolve_text(bundles[0].get('description', ''))
            tn = resolve_text(info.get('name')) or resolve_text(effect.get('name', ''))
            if tn:
                tvalues = build_value_map(effect_table, eid, attr_en_map, param_type_map)
                talents.append({
                    'name': strip_tags(tn),
                    'description': strip_tags(replace_placeholders(desc, tvalues))
                })

        # ── potentials ──
        potentials = []
        pot_data = pot_table.get(char_id, {})
        bundles = pot_data.get('potentialUnlockBundle', [])
        for p in bundles:
            eid = p.get('potentialEffectId')
            effect = effect_table.get(eid, {})
            desc = resolve_text(effect.get('desc', ''))
            if not desc:
                patch = skill_patch.get(eid, {})
                bundles_2 = patch.get('SkillPatchDataBundle', [])
                if bundles_2:
                    desc = resolve_text(bundles_2[0].get('description', ''))
            pn = resolve_text(p.get('name', ''))
            if pn:
                pvalues = build_value_map(effect_table, eid, attr_en_map, param_type_map)
                potentials.append({
                    'name': strip_tags(pn),
                    'description': strip_tags(replace_placeholders(desc, pvalues))
                })

        # ── combat skills (from CharGrowthTable.skillGroupMap) ──
        skill_type_map = {0: 'basicAttack', 1: 'battleSkill', 2: 'ultimate', 3: 'comboSkill'}
        combat_skills = {}
        skill_groups = growth.get('skillGroupMap', {})
        for sg in skill_groups.values():
            sg_type = sg.get('skillGroupType')
            key = skill_type_map.get(sg_type)
            if not key:
                continue
            skill_name = resolve_text(sg.get('name', ''))
            desc = resolve_text(sg.get('desc', ''))
            if skill_name:
                # Build value map from ALL skill patch blackboards in the group
                values = {}
                for sid in sg.get('skillIdList', []):
                    patch = skill_patch.get(sid, {})
                    for bundle in patch.get('SkillPatchDataBundle', []):
                        for bb in bundle.get('blackboard', []):
                            if bb and bb.get('key'):
                                values[bb['key']] = bb.get('value', 0)
                # Also try groupId as fallback
                gid = sg.get('skillGroupId', '')
                if gid:
                    patch = skill_patch.get(gid, {})
                    for bundle in patch.get('SkillPatchDataBundle', []):
                        for bb in bundle.get('blackboard', []):
                            if bb and bb.get('key') and bb['key'] not in values:
                                values[bb['key']] = bb.get('value', 0)
                desc = replace_placeholders(desc, values)
                combat_skills[key] = {
                    'name': strip_tags(skill_name),
                    'description': strip_tags(desc).strip()
                }

        operators[slug] = {
            'name': strip_tags(name),
            'talents': talents,
            'potentials': potentials,
            'combatSkills': combat_skills,
        }

    return operators


def load_json(path):
    if not os.path.exists(path):
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    table_dir = sys.argv[1] if len(sys.argv) > 1 else '../../zmd/AKEDatabase/public/TableCfg'
    old_base = sys.argv[2] if len(sys.argv) > 2 else None

    locale_map = {'CN': 'zh', 'EN': 'en'}

    for locale, outfile in [('CN', 'operators_zh.json'), ('EN', 'operators_en.json')]:
        old_slugs = None
        old_data = None
        if old_base and os.path.isdir(old_base):
            old_file = os.path.join(old_base, locale_map[locale], 'operators.json')
            if os.path.exists(old_file):
                with open(old_file, 'r', encoding='utf-8') as f:
                    old_data = json.load(f)
                old_slugs = set(old_data.keys())
        operators = export_operators(table_dir, locale=locale, old_slugs=old_slugs)

        # Merge old file for ordering and subSkills
        if old_data:
            # Slug remap from old → new (e.g. mi-fu → mifu)
            slug_remap = {}
            for new_slug in operators:
                undashed = new_slug.replace('-', '')
                for old_slug in old_data:
                    if old_slug not in operators and old_slug.replace('-', '') == undashed:
                        slug_remap[old_slug] = new_slug
                        break
            ordered = {}
            for old_slug in old_data:
                slug = slug_remap.get(old_slug, old_slug)
                if slug in operators:
                    entry = operators[slug]
                    # Carry over subSkills from old data
                    if 'subSkills' in old_data[slug]:
                        entry['subSkills'] = old_data[slug]['subSkills']
                    ordered[slug] = entry
            # Append any new operators not in old file
            for slug, data in operators.items():
                if slug not in ordered:
                    ordered[slug] = data
            operators = ordered

        # Ensure combatSkills key order: basicAttack, battleSkill, comboSkill, ultimate
        skill_order = ['basicAttack', 'battleSkill', 'comboSkill', 'ultimate']
        for slug, data in operators.items():
            cs = data.get('combatSkills', {})
            if cs:
                ordered_cs = {}
                for sk in skill_order:
                    if sk in cs:
                        ordered_cs[sk] = cs[sk]
                data['combatSkills'] = ordered_cs

        with open(outfile, 'w', encoding='utf-8') as f:
            json.dump(operators, f, ensure_ascii=False, indent=2)
        print(f'{outfile}: {len(operators)} operators')


if __name__ == '__main__':
    main()
