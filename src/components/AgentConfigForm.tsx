// frontend/components/AgentConfigForm.tsx
'use client';
import React, { useState } from 'react';
import { AgentConfigBase, ScenarioFieldType } from '../types';
import styles from './Form.module.css';

const INITIAL_PROMPT = `
You are the "Dispatch Agent" and your sole objective is to perform cargo check-ins and respond to driver emergencies in a professional, human, and efficient manner.

## 1. Persona and Tone
- Role: Logistics Agent.
- Tone: Professional, calm, and empathetic. Use frequent backchanneling (uh-huh) to maintain human flow.
- Call Context: You are calling {{driver_name}} about Load #{{load_number}}.

## 2. Starting Logic
Always begin with a greeting and an open question:
"Hello {{driver_name}}, this is Dispatch with a check-in call about load {{load_number}}. What is your current status?"

## 3. Emergency Logic (CRITICAL INTERRUPTION)
This rule has the highest priority. If the driver interrupts or mentions any emergency keywords (accident, blowout, breakdown, emergency), IMMEDIATELY abandon the current topic and initiate the Emergency Protocol:
1. Immediate Confirmation: "Understood, that sounds serious. I will help you, but I need some critical information."
2. Data Collection: Ask the type of emergency, confirm safety status and injuries, ask for the exact location, and confirm if the cargo is secure.
3. Escalation: After collecting the data, state: "Thank you. I am now transferring you to a human dispatcher."

## 4. Standard Check-in Logic (Scenario 1)
- If the status is 'Driving' / 'Delayed': Collect current_location, eta, and delay_reason. Conclude by reminding about the POD (Proof of Delivery).
- If the status is 'Arrived' / 'Unloading': Collect unloading_status. Conclude by confirming the POD.

## 5. Special Cases (Robustness)
- Uncooperative Driver: Try asking again ONCE. If that fails, politely end the call.
- Noisy Environment: Ask them to repeat, MAXIMUM twice. If that fails, end the call, escalating to message contact.

SUCCESS: The call is only successful when all necessary fields are collected.
`;

const INITIAL_SCENARIO_FIELDS: Record<string, ScenarioFieldType> = {
    call_outcome: 'text',
    driver_status: 'text',
    current_location: 'text',
    eta: 'text',
    delay_reason: 'text',
    unloading_status: 'text',
    pod_reminder_acknowledged: 'boolean',
    emergency_type: 'text',
    safety_status: 'text',
    injury_status: 'text',
    emergency_location: 'text',
    load_secure: 'boolean',
    escalation_status: 'text',
};

interface AgentConfigFormProps {
    onUpdate: () => void;
}

const AgentConfigForm: React.FC<AgentConfigFormProps> = ({ onUpdate }) => {
    const [config, setConfig] = useState<AgentConfigBase>({
        name: 'Logistics Check-in/Emergency Agent',
        system_prompt: INITIAL_PROMPT.trim(),
        scenario_fields: INITIAL_SCENARIO_FIELDS,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/agents/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            if (response.ok) {
                alert('Agent Configuration saved and registered with Retell!');
                onUpdate(); 
            } else {
                const error = await response.json();
                alert(`Failed to save configuration: ${error.detail || response.statusText}`);
            }
        } catch (error) {
            alert('Connection error with FastAPI backend.');
            console.error('API Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>1. Agent Configuration</h3>
            
            <div className={styles.formGroup}>
                <label htmlFor="agent_name" className={styles.label}>
                    Agent Name
                </label>
                <input 
                    type="text" 
                    id="agent_name"
                    value={config.name}
                    onChange={e => setConfig({ ...config, name: e.target.value })}
                    className={styles.input}
                    required 
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="system_prompt" className={styles.label}>
                    System Prompt (Master LLM Logic)
                </label>
                <textarea 
                    id="system_prompt"
                    value={config.system_prompt} 
                    onChange={e => setConfig({ ...config, system_prompt: e.target.value })}
                    rows={15} 
                    className={styles.textarea}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Structured Data Fields (For Post-Processing)
                </label>
                <pre className={styles.preformatted}>
                    {JSON.stringify(config.scenario_fields, null, 2)}
                </pre>
            </div>
            
            <button 
                type="submit" 
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={isLoading}
            >
                {isLoading ? 'Saving...' : '💾 Save & Register Agent'}
            </button>
        </form>
    );
};
export default AgentConfigForm;