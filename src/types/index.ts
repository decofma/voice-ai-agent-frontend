// frontend/types/index.ts
export type ScenarioFieldType = 'text' | 'boolean';

export interface AgentConfigBase {
  name: string;
  system_prompt: string;
  scenario_fields: Record<string, ScenarioFieldType>;
}

export interface AgentConfig extends AgentConfigBase {
  id: number;
  retell_agent_id: string | null;
}

export interface CallTriggerData {
  agent_config_id: number;
  driver_name: string;
  driver_phone: string;
  load_number: string;
}

export type CallStatus = 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';

export interface CallRecord {
  id: number;
  agent_config_id: number;
  driver_name: string;
  driver_phone: string;
  load_number: string;
  call_status: CallStatus;
  call_outcome: string | null;
  structured_summary: Record<string, any> | null;
  full_transcript: string | null;
}