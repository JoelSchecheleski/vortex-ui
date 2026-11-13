import {
  VortexAICommand,
  VortexAIIntegration,
  VortexAIRequest,
  VortexAIResponse,
} from './ai.types';

/**
 * Adapter local sem LLM — interpreta intents simples (PT/EN)
 * e devolve commands tipados da allowlist do DataGrid.
 */
export class VortexMockAIIntegration implements VortexAIIntegration {
  async sendRequest(req: VortexAIRequest): Promise<VortexAIResponse> {
    if (req.feature === 'ai-column') {
      return generateAiColumn(req);
    }

    if (req.feature === 'editor') {
      const raw = (req.prompt ?? '').replace(/^Reescreva[^\n]*\n+/i, '').trim();
      const text = raw
        ? raw.charAt(0).toUpperCase() + raw.slice(1).replace(/\s+/g, ' ')
        : 'Texto reescrito pelo adapter mock.';
      return { title: 'Editor AI', text };
    }

    const lastUser =
      [...(req.messages ?? [])].reverse().find((m) => m.role === 'user')?.content ??
      req.prompt ??
      '';

    const commands = parseGridIntent(lastUser, req);
    if (commands.length === 0) {
      return {
        title: 'Ajuda',
        text:
          'Posso filtrar, ordenar ou limpar filtros. Exemplos: "Filtrar setor por Saúde", "Ordenar por região", "Limpar filtros".',
        commands: [],
      };
    }

    const summaries = commands.map(describeCommand).join(' · ');
    return {
      title: 'Comando aplicado',
      text: summaries,
      commands,
    };
  }
}

function generateAiColumn(req: VortexAIRequest): VortexAIResponse {
  const prompt = (req.prompt ?? '').trim() || 'Resuma a linha';
  const rows = req.context.rows ?? [];
  const cells = rows.map((row) => {
    const key = String(row['id'] ?? row['key'] ?? JSON.stringify(row));
    const product = String(row['product'] ?? row['name'] ?? 'item');
    const sector = String(row['sector'] ?? row['region'] ?? '');
    const amount = row['saleAmount'];
    const amountLabel =
      typeof amount === 'number'
        ? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
        : '';

    let value: string;
    const p = prompt.toLowerCase();
    if (p.includes('resumo') || p.includes('summary') || p.includes('frase')) {
      value = [product, sector && `em ${sector}`, amountLabel && `(${amountLabel})`]
        .filter(Boolean)
        .join(' ');
    } else if (p.includes('risco') || p.includes('risk')) {
      value = Number(amount) > 8000 ? 'Alto' : Number(amount) > 4000 ? 'Médio' : 'Baixo';
    } else if (p.includes('tag') || p.includes('categoria')) {
      value = `${product.split(/(?=[A-Z])/).join('-')}`.slice(0, 24);
    } else {
      value = `${prompt.replace(/\s+/g, ' ').slice(0, 40)} → ${product}`;
    }

    return { rowKey: key, value };
  });

  return {
    title: 'AI Column',
    text: `${cells.length} célula(s) gerada(s).`,
    data: { cells },
  };
}

function parseGridIntent(text: string, req: VortexAIRequest): VortexAICommand[] {
  const raw = text.trim();
  const lower = normalize(raw);
  if (!lower) return [];

  if (lower.includes('ajuda') || lower === 'help') {
    return [];
  }

  if (lower.includes('limpar filtro') || lower.includes('clear filter')) {
    return [{ type: 'filter.clear' }];
  }

  const filterMatch =
    lower.match(/filtrar\s+(?:setor|sector)\s+por\s+(.+)/) ||
    lower.match(/filter\s+(?:setor|sector)\s+by\s+(.+)/) ||
    lower.match(/filtrar\s+(\w+)\s+por\s+(.+)/) ||
    lower.match(/filter\s+(\w+)\s+by\s+(.+)/);

  if (filterMatch) {
    if (filterMatch.length === 2) {
      return [
        {
          type: 'filter.set',
          payload: { field: 'sector', value: restoreCase(filterMatch[1]!, raw), operator: 'contains' },
        },
      ];
    }
    const field = mapField(filterMatch[1]!, req);
    const value = restoreCase(filterMatch[2]!, raw);
    return [{ type: 'filter.set', payload: { field, value, operator: 'contains' } }];
  }

  const sortMatch =
    lower.match(/ordenar\s+por\s+(\w+)/) ||
    lower.match(/sort\s+by\s+(\w+)/);

  if (sortMatch) {
    const field = mapField(sortMatch[1]!, req);
    const direction = lower.includes('desc') ? 'desc' : 'asc';
    return [{ type: 'sort.set', payload: { field, direction } }];
  }

  if (lower.includes('agrupar') || lower.includes('group by')) {
    const field =
      mapField(
        (lower.match(/agrupar\s+por\s+(\w+)/) || lower.match(/group\s+by\s+(\w+)/))?.[1] ?? 'product',
        req
      );
    return [
      {
        type: 'group.set',
        payload: { field },
      },
    ];
  }

  return [];
}

function mapField(token: string, req: VortexAIRequest): string {
  const t = normalize(token);
  const aliases: Record<string, string> = {
    regiao: 'region',
    região: 'region',
    region: 'region',
    setor: 'sector',
    sector: 'sector',
    produto: 'product',
    product: 'product',
    cliente: 'customer',
    customer: 'customer',
    valor: 'saleAmount',
    preco: 'saleAmount',
    price: 'saleAmount',
    id: 'id',
  };
  if (aliases[t]) return aliases[t]!;

  const cols = req.context.columns ?? [];
  const byHeader = cols.find((c) => normalize(c.header) === t || normalize(c.field) === t);
  return byHeader?.field ?? token;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim();
}

function restoreCase(matched: string, original: string): string {
  const idx = normalize(original).indexOf(normalize(matched));
  if (idx >= 0) {
    return original.trim().slice(idx, idx + matched.length);
  }
  // Capitaliza primeira letra para valores como "saúde"
  return matched.charAt(0).toUpperCase() + matched.slice(1);
}

function describeCommand(cmd: VortexAICommand): string {
  switch (cmd.type) {
    case 'filter.set':
      return `Filtro: ${cmd.payload?.['field']} = ${cmd.payload?.['value']}`;
    case 'filter.clear':
      return 'Filtros limpos';
    case 'sort.set':
      return `Ordenação: ${cmd.payload?.['field']} ${cmd.payload?.['direction']}`;
    case 'group.set':
      return `Agrupar por ${cmd.payload?.['field']} (preview — grouping completo em fase futura)`;
    default:
      return cmd.type;
  }
}
