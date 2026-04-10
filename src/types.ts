export type OrderStatus = 
  | 'RASCUNHO'
  | 'REAJUSTE A.A'
  | 'REAJUSTE A.F'
  | 'AGUARDANDO COTAÇÃO'
  | 'AGUARDANDO APROVAÇÃO DA ÁREA'
  | 'AGUARDANDO APROVAÇÃO FINAL'
  | 'APROVADO'
  | 'P.O EMITIDA'
  | 'PAGAMENTO AGENDADO'
  | 'PAGAMENTO REALIZADO'
  | 'AGUARDANDO RECIBO'
  | 'FINALIZADO'
  | 'CANCELADO'
  | 'REJEITADO';

export type OrderType = 'SERVICE' | 'PRODUCT';

export interface Order {
  id: string;
  number: string;
  title: string;
  type: OrderType;
  company: string;
  plant: string;
  department: string;
  deadline: string;
  status: OrderStatus;
  value: number;
  currency: string;
}

export interface DashboardStats {
  totalOrders: number;
  inQuotation: number;
  awaitingApproval: number;
  awaitingPO: number;
  awaitingPayment: number;
  totalFilteredValue: number;
}
