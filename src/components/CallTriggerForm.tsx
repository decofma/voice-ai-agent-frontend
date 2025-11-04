// frontend/components/CallTriggerForm.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { AgentConfig, CallTriggerData } from '../types';
import { RetellWebClient } from 'retell-client-js-sdk'; 
import styles from './Form.module.css';

interface CallTriggerFormProps {
    refreshKey: number;
    onUpdate: () => void;
}

const CallTriggerForm: React.FC<CallTriggerFormProps> = ({ refreshKey, onUpdate }) => {
    const [agents, setAgents] = useState<AgentConfig[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    
    const [retellClient] = useState(() => new RetellWebClient());

    const [formData, setFormData] = useState<CallTriggerData>({
        agent_config_id: 0,
        driver_name: 'Mike (Web Call)',
        driver_phone: 'N/A (Web Call)', 
        load_number: '7891-B',
    });

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await fetch('/api/v1/agents/');
                if (res.ok) {
                    const data: AgentConfig[] = await res.json();
                    setAgents(data);
                }
            } catch (error) {
                console.error("Error fetching agents:", error);
            }
        };
        fetchAgents();
    }, [refreshKey]);

    useEffect(() => {
        const handleConversationStarted = () => {
            console.log("Conversation started");
            setIsCallActive(true); 
        };
        const handleConversationEnded = () => {
            console.log("Conversation ended.");
            setIsCallActive(false);
            onUpdate(); 
        };
        const handleError = (error: string) => {
            console.error("Web call error:", error);
            setIsCallActive(false);
            onUpdate();
        };
        const handleUpdate = (update: any) => {
            console.log("Update received:", update.transcript);
        };

        retellClient.on('conversationStarted', handleConversationStarted);
        retellClient.on('conversationEnded', handleConversationEnded);
        retellClient.on('error', handleError);
        retellClient.on('update', handleUpdate); 

        return () => {
            retellClient.off('conversationStarted', handleConversationStarted);
            retellClient.off('conversationEnded', handleConversationEnded);
            retellClient.off('error', handleError);
            retellClient.off('update', handleUpdate);
        };
    }, [retellClient, onUpdate]);

    const handleTrigger = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agent_config_id) return alert("Please select an agent.");
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/calls/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const result = await response.json();
                
                retellClient.startConversation({
                    callId: result.call_id,
                    sampleRate: result.sample_rate, 
                    enableUpdate: true, 
                });
                onUpdate(); 
            } else {
                const error = await response.json();
                alert(`Failed to trigger call: ${error.detail || response.statusText}`);
            }
        } catch (error) {
            alert('Connection error with FastAPI backend.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStopCall = () => {
        retellClient.stopConversation();
    };

    return (
        <form onSubmit={handleTrigger} className={styles.form}>
            <h3>2. Trigger Call (Web Call)</h3>

            <div className={styles.formGroup}>
                <label htmlFor="agent_select" className={styles.label}>
                    Select Agent
                </label>
                <select 
                    id="agent_select"
                    onChange={(e) => setFormData({ ...formData, agent_config_id: parseInt(e.target.value) })}
                    className={styles.select}
                    required
                >
                    <option value={0}>Select a configured agent...</option>
                    {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name} (ID: {agent.id})</option>
                    ))}
                </select>
            </div>
            
            <div className={styles.formGroup}>
                <label htmlFor="driver_name" className={styles.label}>
                    Driver Name (Context)
                </label>
                <input 
                    type="text" 
                    id="driver_name"
                    value={formData.driver_name}
                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                    className={styles.input}
                    required 
                />
            </div>
            <input type="hidden" value={formData.driver_phone} />
            <div className={styles.formGroup}>
                <label htmlFor="load_number" className={styles.label}>
                    Load Number (Context)
                </label>
                <input 
                    type="text" 
                    id="load_number"
                    value={formData.load_number}
                    onChange={(e) => setFormData({ ...formData, load_number: e.target.value })}
                    className={styles.input}
                    required 
                />
            </div>

            {!isCallActive ? (
                <button 
                    type="submit" 
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    disabled={isLoading || !formData.agent_config_id}
                >
                    {isLoading ? 'Registering...' : '▶️ Start Test Call'}
                </button>
            ) : (
                <button 
                    type="button" 
                    onClick={handleStopCall}
                    className={`${styles.button} ${styles.buttonDanger}`}
                >
                    ■ Stop Call
                </button>
            )}
        </form>
    );
};
export default CallTriggerForm;