export interface Audit {
  id: number;
  auditName: string;
  category: string;
  startDate: string;
  endDate: string;
  auditee:  'Engineering' | 
  'Marketing & Bussines Development' | 
  'Tercapai' |
  'Commercial Sales' | 
  'Project Planning & Controlling' | 
  'Human Capital & General Affair' | 
  'Information System' | 
  'Quality, Health, Safety & Environment' | 
  'Internal Audit' | 
  'Project Operation Management' | 
  'Operation & Maintenance' | 
  'Finance & Accounting' | 
  'Corporate Strategic Planning' | 
  'Supply Chain Management';
  leadAuditor: string;
  scope: string;
  status : 'Belum selesai' | 'Selesai';
}
