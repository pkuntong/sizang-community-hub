export interface Report {
  id: string;
  type: 'THREAD' | 'REPLY' | 'GROUP' | 'RESOURCE' | 'USER';
  targetId: string;
  reporterId: string;
  reason: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 