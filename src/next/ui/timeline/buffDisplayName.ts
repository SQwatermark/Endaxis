export interface BuffDisplayI18n {
  readonly te: (key: string) => boolean;
  readonly t: (key: string) => string;
}

/**
 * 与旧版 getEffectName 保持同一解析顺序：短名称键先进入 effects.name 命名空间，
 * 完整路径随后直接解析。Buff ID 只作为证据透明的最后回退，不参与名称猜测。
 */
export function resolveBuffDisplayName(
  nameKey: string | undefined,
  buffId: string,
  i18n: BuffDisplayI18n,
): string {
  const key = nameKey?.trim();
  if (key) {
    const effectKey = `effects.name.${key}`;
    if (i18n.te(effectKey)) return i18n.t(effectKey);
    if (i18n.te(key)) return i18n.t(key);
    return key;
  }
  return buffId;
}
