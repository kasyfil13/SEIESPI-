export interface EmailHistory {
  email_to: string;
  evidenceId: string;
  message: string;
  status: 'SUCCESS' | 'FAILED';
  sentAt: Date;
}
