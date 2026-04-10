import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle,
  ArrowLeft,
  Info,
  Trash2,
  CreditCard,
  XCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const config: Record<OrderStatus, { color: string, icon: any }> = {
    'RASCUNHO': { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: FileText },
    'REAJUSTE A.A': { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle },
    'REAJUSTE A.F': { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle },
    'AGUARDANDO COTAÇÃO': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
    'AGUARDANDO APROVAÇÃO DA ÁREA': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    'AGUARDANDO APROVAÇÃO FINAL': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    'APROVADO': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    'P.O EMITIDA': { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: FileText },
    'PAGAMENTO AGENDADO': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: CreditCard },
    'PAGAMENTO REALIZADO': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    'AGUARDANDO RECIBO': { color: 'bg-cyan-100 text-cyan-700 border-cyan-200', icon: FileText },
    'FINALIZADO': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    'CANCELADO': { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: XCircle },
    'REJEITADO': { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
  };

  const { color, icon: Icon } = config[status] || { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 border ${color}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

// Reusable collapsible section
const Section = ({ title, count, defaultOpen = true, children }: { title: string, count?: number, defaultOpen?: boolean, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden mb-4 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-blue-900 uppercase tracking-wide">{title}</h3>
          {count !== undefined && (
            <span className="bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-t border-slate-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function OrderDrawer({ order, isOpen, onClose }: OrderDrawerProps) {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', boxShadow: '-20px 0 40px rgba(0,0,0,0)' }}
            animate={{ x: 0, boxShadow: '-20px 0 40px rgba(0,0,0,0.1)' }}
            exit={{ x: '100%', boxShadow: '-20px 0 40px rgba(0,0,0,0)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-5xl bg-slate-50 z-50 flex flex-col overflow-hidden border-l border-slate-200"
          >
            {/* Header Area (Sticky) */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Dashboard</span>
                  <span>/</span>
                  <span>Pedidos</span>
                  <span>/</span>
                  <span className="text-slate-900">Visualizar</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    <Info size={14} />
                    Modo de Consulta
                  </span>
                  <button 
                    onClick={onClose}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Voltar
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    PEDIDO <span className="text-blue-600">{order.number}</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="font-semibold text-slate-500 uppercase">Responsável:</span>
                    <span className="font-bold text-blue-600 uppercase">Recebimento</span>
                    <span className="text-slate-300">|</span>
                    <span className="font-semibold text-slate-500 uppercase">Próxima Ação:</span>
                    <span className="italic text-slate-700">"Confirmar recibo e finalizar pedido"</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Status do Fluxo */}
              <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-blue-900/60 uppercase tracking-wider mb-1">Responsável Atual</p>
                    <p className="text-sm font-bold text-slate-900">Recebimento</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-900/60 uppercase tracking-wider mb-1">Próxima Ação / Situação</p>
                    <p className="text-sm font-bold text-slate-900">Confirmar recibo e finalizar pedido</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                    <ArrowRight size={14} />
                    Mover para Recebimento
                  </button>
                  <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <CheckCircle2 size={14} />
                    Finalizar Pedido
                  </button>
                </div>
              </div>

              {/* Dados Gerais */}
              <Section title="Dados Gerais do Pedido">
                <div className="relative">
                  <div className="absolute top-0 right-0 text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Código de Rastreio</p>
                    <p className="text-lg font-bold text-blue-600">{order.number}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 mt-2">
                    <div className="col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Título do Pedido <span className="text-red-500">*</span></label>
                      <input type="text" disabled value={order.title} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                    </div>
                    
                    <div className="col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descrição ou Justificativa <span className="text-red-500">*</span></label>
                      <textarea disabled rows={3} value="Aquisição necessária para manter as operações da planta. Orçamento aprovado no Q1." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 resize-none" />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo de Pedido <span className="text-red-500">*</span></label>
                      <input type="text" disabled value={order.type === 'PRODUCT' ? 'PRODUTO (PRD)' : 'SERVIÇO (SRV)'} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fornecedor</label>
                      <input type="text" disabled value="[SUP-000010] ITA - Internet Technologies Angola, SA" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Grau de Necessidade <span className="text-red-500">*</span></label>
                      <input type="text" disabled value="Normal" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Data de Vencimento <span className="text-red-500">*</span></label>
                      <input type="text" disabled value={new Date(order.deadline).toLocaleDateString('pt-BR')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                      {new Date(order.deadline) < new Date() && (
                        <p className="text-[10px] font-bold text-amber-600 mt-1 flex items-center gap-1"><AlertCircle size={10}/> O DOCUMENTO ESTÁ VENCIDO.</p>
                      )}
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Departamento <span className="text-red-500">*</span></label>
                      <input type="text" disabled value={order.department} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Empresa <span className="text-red-500">*</span></label>
                      <input type="text" disabled value={order.company} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                      <p className="text-[9px] text-slate-400 mt-1 uppercase">Empresa bloqueada pois o pedido já possui itens.</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Resumo Financeiro */}
              <Section title="Resumo Financeiro do Pedido" count={0}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Valor Total Estimado</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{order.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-slate-500 mt-2">Este valor é recalculado automaticamente a partir dos itens inseridos ao recarregar a tela.</p>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Desconto Global ({order.currency})</label>
                    <input type="text" disabled value="0" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                    <p className="text-[10px] text-slate-500 mt-1 uppercase">Abatimento que reduz a base tributável deste pedido.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Moeda Principal do Pedido</label>
                    <input type="text" disabled value={`${order.currency} (Kz)`} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700" />
                    <p className="text-[10px] text-slate-500 mt-1 uppercase">Moeda bloqueada pois o pedido já possui itens.</p>
                  </div>
                </div>
              </Section>

              {/* Itens do Pedido */}
              <Section title="Itens do Pedido" count={2}>
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">Itens da Requisição</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">#</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Descrição</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Unid.</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-center">Qtd</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Planta</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">IVA</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Preço Unit.</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Total</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-slate-500">2</td>
                        <td className="px-4 py-3 font-medium text-slate-900">Internet Prata 100Mbps Fibra - Site II - Refriango</td>
                        <td className="px-4 py-3 text-slate-600">EA</td>
                        <td className="px-4 py-3 text-slate-600 text-center">1</td>
                        <td className="px-4 py-3 text-slate-600">Viana 1</td>
                        <td className="px-4 py-3 text-slate-600">14%</td>
                        <td className="px-4 py-3 text-slate-900 text-right">1 140 000,00</td>
                        <td className="px-4 py-3 font-bold text-slate-900 text-right">974 700,00</td>
                        <td className="px-4 py-3 text-slate-400 text-xs text-center">Somente leitura</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-slate-500">1</td>
                        <td className="px-4 py-3 font-medium text-slate-900">Internet Prata (1:3) 20Mbps - ZEE</td>
                        <td className="px-4 py-3 text-slate-600">EA</td>
                        <td className="px-4 py-3 text-slate-600 text-center">1</td>
                        <td className="px-4 py-3 text-slate-600">Viana 2</td>
                        <td className="px-4 py-3 text-slate-600">14%</td>
                        <td className="px-4 py-3 text-slate-900 text-right">510 000,00</td>
                        <td className="px-4 py-3 font-bold text-slate-900 text-right">540 702,00</td>
                        <td className="px-4 py-3 text-slate-400 text-xs text-center">Somente leitura</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Section>

              {/* Anexos */}
              <Section title="Anexos do Pedido" count={3}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Proforma */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Proforma</h5>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-start gap-3 shadow-sm group cursor-pointer hover:border-blue-300 transition-colors">
                      <FileText size={16} className="text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          FA20264970.pdf <CheckCircle2 size={12} className="text-emerald-500" />
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">Enviado por Administrador do Sistema em 09/04/2026 22:03</p>
                      </div>
                      <Download size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* P.O */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">P.O</h5>
                      <button className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"><Upload size={12}/> ADICIONAR</button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-start gap-3 shadow-sm group cursor-pointer hover:border-blue-300 transition-colors">
                      <FileText size={16} className="text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1 line-clamp-1">
                          PO_Servios_ECF11_2026176_-_ITA.pdf <CheckCircle2 size={12} className="text-emerald-500" />
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">Enviado por Administrador do Sistema em 09/04/2026 22:05</p>
                      </div>
                      <Download size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Cronograma */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cronograma de Pagamento</h5>
                    </div>
                    <p className="text-xs italic text-slate-400">Nenhum documento</p>
                  </div>

                  {/* Comprovante */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Comprovante de Pagamento</h5>
                      <button className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"><Upload size={12}/> ADICIONAR</button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-start gap-3 shadow-sm group cursor-pointer hover:border-blue-300 transition-colors">
                      <FileText size={16} className="text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1 line-clamp-1">
                          Encomenda_Mat_EscritrioDiversos_EC...
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">Enviado por Administrador do Sistema em 09/04/2026 22:06</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download size={14} className="text-blue-600" />
                        <Trash2 size={14} className="text-red-500" />
                      </div>
                    </div>
                  </div>

                  {/* Documentos de Apoio */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Documentos de Apoio</h5>
                    </div>
                    <p className="text-xs italic text-slate-400">Nenhum documento</p>
                  </div>
                </div>
              </Section>

              {/* Histórico */}
              <Section title="Histórico do Pedido" count={11} defaultOpen={false}>
                <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 py-4">
                  {[
                    { date: '09/04/2026 22:06', action: 'PAYMENT_COMPLETED', status: 'Pagamento Realizado', user: 'Administrador do Sistema', comment: 'Pagamento realizado na totalidade. Liquidado via portal' },
                    { date: '09/04/2026 22:06', action: 'DOC. ANEXADO', status: 'P.O Emitida', user: 'Administrador do Sistema', comment: 'Documento "Encomenda Mat Escritório.Diversos ECF10 2026.101 - NCR.pdf" (Comprovante de Pagamento) adicionado ao pedido por Administrador do Sistema.' },
                    { date: '09/04/2026 22:05', action: 'REGISTER_PO', status: 'P.O Emitida', user: 'Administrador do Sistema', comment: '' },
                    { date: '09/04/2026 22:05', action: 'DOC. ANEXADO', status: 'Aprovado', user: 'Administrador do Sistema', comment: 'Documento "PO Serviços ECF11 2026.176 - ITA.pdf" (P.O) adicionado ao pedido por Administrador do Sistema.' },
                    { date: '09/04/2026 22:05', action: 'APPROVE', status: 'Aprovado', user: 'Administrador do Sistema', comment: 'Aprovação Final realizada.' },
                  ].map((event, i) => (
                    <div key={i} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Data / Hora</p>
                          <p className="text-xs font-medium text-slate-900">{event.date}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ação / Novo Status</p>
                          <p className="text-xs font-bold text-blue-600">{event.action}</p>
                          <p className="text-xs font-medium text-slate-700 flex items-center gap-1 mt-0.5">
                            <ArrowRight size={10} className="text-slate-400"/> {event.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Responsável / Comentário</p>
                          <p className="text-xs font-bold text-slate-900">{event.user}</p>
                          {event.comment && <p className="text-xs italic text-slate-500 mt-1">"{event.comment}"</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
