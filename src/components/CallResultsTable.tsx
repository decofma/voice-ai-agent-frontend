// frontend/components/CallResultsTable.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { CallRecord, CallStatus } from '../types';
import styles from './Table.module.css';

interface CallResultsTableProps {
    refreshKey: number;
}

const statusStyles: Record<CallStatus, string> = {
    COMPLETED: styles.statusCOMPLETED,
    PENDING: styles.statusPENDING,
    ANALYZING: styles.statusANALYZING,
    FAILED: styles.statusFAILED,
};

const CallResultsTable: React.FC<CallResultsTableProps> = ({ refreshKey }) => {
    const [results, setResults] = useState<CallRecord[]>([]);

    const fetchResults = async () => {
        try {
            const res = await fetch('/api/v1/calls/results');
            if (res.ok) {
                const data: CallRecord[] = await res.json();
                setResults(data); 
            }
        } catch (error) {
            console.error("Error fetching results:", error);
        }
    };

    useEffect(() => {
        fetchResults();
        const interval = setInterval(fetchResults, 5000); 
        return () => clearInterval(interval);
    }, [refreshKey]);

    const displaySummary = (record: CallRecord) => {
        alert(
            `Call Outcome: ${record.call_outcome || 'N/A'}\n\n` +
            `--- Structured Summary ---\n${JSON.stringify(record.structured_summary, null, 2)}\n\n` +
            `--- Full Transcript ---\n${record.full_transcript || 'N/A'}`
        );
    };

    return (
        <div className="flex flex-col space-y-4">
            <h3>3. Call Records & Results</h3>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>ID</th>
                            <th className={styles.th}>Driver</th>
                            <th className={styles.th}>Load #</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Outcome</th>
                            <th className={styles.th} style={{textAlign: 'right'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.td} style={{textAlign: 'center', fontStyle: 'italic', color: '#94a3b8'}}>
                                    No call records found.
                                </td>
                            </tr>
                        ) : (
                            results.map(record => (
                                <tr key={record.id}>
                                    <td className={`${styles.td} ${styles.tdId}`}>{record.id}</td>
                                    <td className={styles.td}>{record.driver_name}</td>
                                    <td className={styles.td}>{record.load_number}</td>
                                    <td className={styles.td}>
                                        <span className={`${styles.statusPill} ${statusStyles[record.call_status]}`}>
                                            {record.call_status}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        {record.call_outcome || 'N/A'}
                                    </td>
                                    <td className={`${styles.td} ${styles.tdActions}`}>
                                        {record.call_status === 'COMPLETED' && (
                                            <button 
                                                onClick={() => displaySummary(record)}
                                                className={styles.actionButton}
                                            >
                                                View Results
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default CallResultsTable;