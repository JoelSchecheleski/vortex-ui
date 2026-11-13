import { VortexAIContext, VortexAIPrivacyPolicy } from './ai.types';

export function projectRowsForAI(
  rows: Record<string, unknown>[],
  policy: VortexAIPrivacyPolicy
): Record<string, unknown>[] {
  const max = policy.maxRowsInContext ?? 100;
  const fields = policy.contextFields;
  const sliced = rows.slice(0, max);
  if (!fields?.length) return sliced;
  return sliced.map((row) => {
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      if (f in row) out[f] = row[f];
    }
    return out;
  });
}

export function emptyAIContext(componentType: string): VortexAIContext {
  return {
    schemaVersion: 1,
    componentType,
    rows: [],
    totalRows: 0,
  };
}
