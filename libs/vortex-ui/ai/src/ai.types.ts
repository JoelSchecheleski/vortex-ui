/** Config opt-in por componente (deny by default). */
export interface VortexAIConfig {
  enabled?: boolean;
  assistant?: {
    enabled?: boolean;
    title?: string;
  };
  /** Campos permitidos no contexto enviado ao modelo (R2). */
  contextFields?: string[];
  /** Cap de linhas no contexto (R3). Default: 100. */
  maxRowsInContext?: number;
}

export interface VortexAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface VortexAIContext {
  schemaVersion: 1;
  componentType: string;
  columns?: Array<{ field: string; header: string }>;
  sort?: { field: string; direction: 'asc' | 'desc' } | null;
  filter?: VortexAIFilterState | null;
  /** Linhas já projetadas (só campos allowlist). */
  rows?: Record<string, unknown>[];
  totalRows?: number;
  meta?: Record<string, unknown>;
}

export interface VortexAIFilterState {
  field: string;
  value: string;
  operator?: 'contains' | 'equals';
}

export interface VortexAIToolDefinition {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

export interface VortexAIRequest {
  feature: 'assistant' | 'ai-column' | 'smart-paste' | 'semantic-search' | 'editor' | string;
  componentType: string;
  componentId?: string;
  messages?: VortexAIMessage[];
  prompt?: string;
  context: VortexAIContext;
  tools?: VortexAIToolDefinition[];
  signal?: AbortSignal;
}

export interface VortexAICommand {
  type: string;
  payload?: Record<string, unknown>;
}

export interface VortexAIResponse {
  title?: string;
  text: string;
  commands?: VortexAICommand[];
  /** Resultados estruturados (ex.: AI Column cells). */
  data?: {
    cells?: Array<{ rowKey: string; value: string }>;
  };
}

export type VortexAIStreamEvent =
  | { type: 'token'; text: string }
  | { type: 'command'; command: VortexAICommand }
  | { type: 'done'; response: VortexAIResponse };

export interface VortexAISuggestion {
  id: string;
  label: string;
  /** Prompt enviado ao adapter se não houver command direto. */
  prompt?: string;
  command?: VortexAICommand;
}

export interface VortexAIRequestCreatingEvent {
  request: VortexAIRequest;
  cancel: boolean;
}

export interface VortexAIPrivacyPolicy {
  contextFields?: string[];
  maxRowsInContext?: number;
}

export interface VortexAICommandSpec {
  type: string;
  description: string;
}

export interface VortexAICapability {
  componentType: string;
  commands: VortexAICommandSpec[];
  projectContext(state: unknown, policy: VortexAIPrivacyPolicy): VortexAIContext;
  execute(command: VortexAICommand): void | Promise<void>;
  suggest?(state: unknown): VortexAISuggestion[];
}

export interface VortexAIIntegration {
  sendRequest(req: VortexAIRequest): Promise<VortexAIResponse>;
  stream?(req: VortexAIRequest): AsyncIterable<VortexAIStreamEvent>;
}
