/** 从已编译动作树收集显式与隐式 Buff 依赖；动态 ID 在来源编译边界解决。 */
export function collectCompiledBuffIds(value: unknown): ReadonlySet<string> {
  return new Set(collectCompiledBuffApplications(value).map(item => item.buffId));
}

export interface CompiledBuffApplicationReference {
  readonly buffId: string;
  readonly target: string;
}

export function collectCompiledBuffApplications(
  value: unknown,
): readonly CompiledBuffApplicationReference[] {
  const applications: CompiledBuffApplicationReference[] = [];
  const visit = (item: unknown): void => {
    if (Array.isArray(item)) {
      item.forEach(visit);
      return;
    }
    if (item === null || typeof item !== 'object') return;
    const record = item as Record<string, unknown>;
    if (record.kind === 'applyKnockDown') {
      const parameters = record.parameters as Record<string, unknown>;
      if (parameters.targetFilter !== 'skipAll') {
        // 原生根动作的隐式安装仍是依赖，不能在从来源图转到正式程序时丢失。
        applications.push({ buffId: 'buff_physical_knockdown', target: 'enemy' });
        if (!parameters.force)
          applications.push({ buffId: 'buff_physical_no_guard', target: 'enemy' });
      }
    }
    if (record.kind === 'applyPhysicalInfliction') {
      const parameters = record.parameters as Record<string, unknown>;
      const type = parameters.type;
      const noGuardBuffId = parameters.noGuardBuffId;
      const abnormalBuffId =
        type === 'fracture' ? parameters.fractureBuffId : parameters.crushedBuffId;
      if (typeof noGuardBuffId !== 'string' || typeof abnormalBuffId !== 'string')
        throw new Error('compiled physical infliction step has invalid Buff identities');
      applications.push({ buffId: noGuardBuffId, target: 'enemy' });
      applications.push({ buffId: abnormalBuffId, target: 'enemy' });
    }
    if (record.kind === 'applyBuff') {
      const parameters = record.parameters;
      if (parameters === null || typeof parameters !== 'object')
        throw new Error('compiled applyBuff step is missing parameters');
      const buffId = (parameters as Record<string, unknown>).buffId;
      if (typeof buffId !== 'string' || buffId.length === 0)
        throw new Error('compiled applyBuff step has an invalid buffId');
      const target = (parameters as Record<string, unknown>).target;
      if (typeof target !== 'string' || target.length === 0)
        throw new Error('compiled applyBuff step has an invalid target');
      applications.push({ buffId, target });
    }
    Object.values(record).forEach(visit);
  };
  visit(value);
  return applications;
}

/** 收集已编译树中会观察 Buff 身份的静态条件；这种空 Buff 是逻辑标记，不能按纯表现裁剪。 */
export function collectCompiledBuffIdentityReadIds(value: unknown): ReadonlySet<string> {
  const ids = new Set<string>();
  const visit = (item: unknown): void => {
    if (Array.isArray(item)) {
      item.forEach(visit);
      return;
    }
    if (item === null || typeof item !== 'object') return;
    const record = item as Record<string, unknown>;
    if (record.kind === 'buffIdStackCompare' && Array.isArray(record.buffIds)) {
      for (const id of record.buffIds) if (typeof id === 'string' && id.length > 0) ids.add(id);
    }
    Object.values(record).forEach(visit);
  };
  visit(value);
  return ids;
}
