import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpRight,
  Package,
  Briefcase,
  Building2,
  MapPin,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CalendarClock,
  Copy,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, OrderStatus, DashboardStats } from '../types';

const MOCK_ORDERS: Order[] = [
  { id: '1', number: 'REQ-10/04/2026-011', title: 'Manutenção Preventiva - Ar Condicionado', type: 'SERVICE', company: 'AlplaPLASTICO', plant: 'Viana 1', department: 'Logística', deadline: '2025-11-04', status: 'APROVADO', value: 1677502.81, currency: 'AOA' },
  { id: '2', number: 'REQ-09/04/2026-007', title: 'Cotação de Insumos - Q2', type: 'PRODUCT', company: 'AlplaPLASTICO', plant: 'Viana 2', department: 'Financeiro', deadline: '2026-04-16', status: 'AGUARDANDO COTAÇÃO', value: 0, currency: 'AOA' },
  { id: '3', number: 'REQ-09/04/2026-006', title: 'Licenças de Software - TI', type: 'PRODUCT', company: 'AlplaPLASTICO', plant: 'Viana 1', department: 'TI', deadline: '2026-04-29', status: 'PAGAMENTO AGENDADO', value: 1515402.00, currency: 'AOA' },
  { id: '4', number: 'REQ-09/04/2026-005', title: 'Serviços de Limpeza Mensal', type: 'SERVICE', company: 'AlplaPLASTICO', plant: 'Viana 1', department: 'TI', deadline: '2026-03-31', status: 'PAGAMENTO REALIZADO', value: 1515402.00, currency: 'AOA' },
  { id: '5', number: 'REQ-10/04/2026-010', title: 'Compra de Mobiliário Escritório', type: 'SERVICE', company: 'AlplaPLASTICO', plant: 'Viana 2', department: 'TI', deadline: '2025-11-04', status: 'CANCELADO', value: 2616020.35, currency: 'AOA' },
  { id: '6', number: 'REQ-10/04/2026-008', title: 'Reparo de Empilhadeira #42', type: 'SERVICE', company: 'AlplaPLASTICO', plant: 'Viana 1', department: 'TI', deadline: '2025-11-04', status: 'REJEITADO', value: 2616020.35, currency: 'AOA' },
  { id: '7', number: 'REQ-09/04/2026-004', title: 'Suprimentos de Escritório', type: 'SERVICE', company: 'AlplaPLASTICO', plant: 'Viana 1', department: 'TI', deadline: '2026-03-31', status: 'RASCUNHO', value: 1329300.00, currency: 'AOA' },
  { id: '8', number: 'REQ-11/04/2026-001', title: 'Atualização de Servidores', type: 'PRODUCT', company: 'AlplaPLASTICO', plant: 'Viana 1', department: 'TI', deadline: '2026-05-10', status: 'REAJUSTE A.A', value: 5400000.00, currency: 'AOA' },
  { id: '9', number: 'REQ-11/04/2026-002', title: 'Treinamento de Segurança', type: 'SERVICE', company: 'AlplaPLASTICO', plant: 'Viana 2', department: 'RH', deadline: '2026-05-15', status: 'REAJUSTE A.F', value: 850000.00, currency: 'AOA' },
  { id: '10', number: 'REQ-11/04/2026-003', title: 'Compra de EPIs', type: 'PRODUCT', company: 'AlplaPLASTICO', plant: 'Viana 1', department: 'Segurança', deadline: '2026-04-20', status: 'AGUARDANDO APROVAÇÃO DA ÁREA', value: 3200000.00, currency: 'AOA' },
  { id: '11', number: 'REQ-11/04/2026-004', title: 'Renovação Frota', type: 'PRODUCT', company: 'AlplaPLASTICO', plant: 'Viana 2', department: 'Logística', deadline: '2026-06-01', status: 'AGUARDANDO APROVAÇÃO FINAL', value: 45000000.00, currency: 'AOA' },
  { id: '12', number: 'REQ-11/04/2026-005', title: 'Consultoria Externa', type: 'SERVICE', company: 'AlplaPLASTICO', plant: 'Viana 1', department: 'Diretoria', deadline: '2026-04-25', status: 'P.O EMITIDA', value: 7500000.00, currency: 'AOA' },
  { id: '13', number: 'REQ-11/04/2026-006', title: 'Auditoria Anual', type: 'SERVICE', company: 'AlplaPLASTICO', plant: 'Viana 1', department: 'Financeiro', deadline: '2026-05-05', status: 'AGUARDANDO RECIBO', value: 2100000.00, currency: 'AOA' },
  { id: '14', number: 'REQ-11/04/2026-007', title: 'Material Promocional', type: 'PRODUCT', company: 'AlplaPLASTICO', plant: 'Viana 2', department: 'Marketing', deadline: '2026-04-10', status: 'FINALIZADO', value: 950000.00, currency: 'AOA' },
];

const STATS: DashboardStats = {
  totalOrders: 7,
  inQuotation: 0,
  awaitingApproval: 0,
  awaitingPO: 0,
  awaitingPayment: 0,
  totalFilteredValue: 13026742.70
};

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

  const { color, icon: Icon } = config[status] || config['CANCELADO'];

  return (
    <span className={`status-badge border ${color}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const KebabMenu = ({ onCopy, onView }: { onCopy: () => void, onView: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className={`p-1.5 rounded-md transition-all ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-blue-400 hover:text-blue-600 hover:bg-blue-50'}`}
      >
        <MoreVertical size={16} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 overflow-hidden"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onCopy(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
            >
              <Copy size={14} />
              Copiar
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onView(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
            >
              <Eye size={14} />
              Visualizar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleSort = (key: keyof Order) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredOrders = useMemo(() => {
    let result = MOCK_ORDERS.filter(order => 
      (order.number.toLowerCase().includes(search.toLowerCase()) || 
       order.title.toLowerCase().includes(search.toLowerCase())) &&
      (filterType === 'all' || order.type === filterType)
    );

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [search, filterType, sortConfig]);

  const actionRequiredOrders = MOCK_ORDERS.filter(o => 
    ['APROVADO', 'AGUARDANDO COTAÇÃO', 'AGUARDANDO APROVAÇÃO DA ÁREA', 'REAJUSTE A.A'].includes(o.status)
  );
  const itemsPerPage = 3;
  const maxCarouselIndex = Math.max(0, actionRequiredOrders.length - itemsPerPage);

  const nextCarousel = () => setCarouselIndex(prev => Math.min(prev + 1, maxCarouselIndex));
  const prevCarousel = () => setCarouselIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pedidos de Compras e Pagamentos</h1>
          <p className="text-slate-500 text-sm">Gerencie e acompanhe todos os pedidos corporativos em tempo real.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm shadow-blue-200 active:scale-95">
          <Plus size={18} />
          Novo Pedido
        </button>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total de Pedidos', value: STATS.totalOrders, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Em Cotação', value: STATS.inQuotation, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Aguardando Aprovação', value: STATS.awaitingApproval, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Aguardando P.O', value: STATS.awaitingPO, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Aguardando Pagamento', value: STATS.awaitingPayment, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden group"
          >
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={80} />
            </div>
          </motion.div>
        ))}
      </section>

      {/* Action Required Section */}
      <section className="space-y-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Para Minha Ação</h2>
            <p className="text-xs text-slate-500">Pedidos que requerem sua intervenção imediata.</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={prevCarousel}
              disabled={carouselIndex === 0}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextCarousel}
              disabled={carouselIndex >= maxCarouselIndex}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="relative">
          <motion.div 
            className="flex gap-4"
            animate={{ x: `calc(-${carouselIndex * (100 / itemsPerPage)}% - ${carouselIndex * (16 / itemsPerPage)}px)` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {actionRequiredOrders.map((order) => (
              <div 
                key={order.id}
                className="min-w-[calc(100%/1-12px)] md:min-w-[calc(100%/2-12px)] lg:min-w-[calc(100%/3-12px)] flex-shrink-0"
              >
                <motion.div 
                  className="glass-card p-5 rounded-2xl hover:shadow-md transition-shadow cursor-pointer group h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${order.type === 'SERVICE' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {order.type === 'SERVICE' ? <Briefcase size={16} /> : <Package size={16} />}
                      </div>
                      <span className="text-xs font-mono text-slate-500">{order.number}</span>
                    </div>
                    <KebabMenu 
                      onCopy={() => console.log('Copiar', order.number)} 
                      onView={() => console.log('Visualizar', order.number)} 
                    />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{order.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Building2 size={12} />
                      {order.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      {order.plant}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <StatusBadge status={order.status} />
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Valor</p>
                      <p className="font-bold text-slate-900">{order.currency} {order.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Explorer Section */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Explorador de Pedidos</h2>
              <p className="text-xs text-slate-500">O restante do portfólio de compras visível para si.</p>
            </div>
            
            {/* Quick Filters (Tabs) */}
            <div className="flex bg-slate-100/80 p-1 rounded-lg w-fit border border-slate-200/50">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'PRODUCT', label: 'Produtos' },
                { id: 'SERVICE', label: 'Serviços' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    filterType === tab.id 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por número ou título..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-bottom border-slate-200">
                  {[
                    { label: 'Número', key: 'number' },
                    { label: 'Título do Pedido', key: 'title' },
                    { label: 'Tipo', key: 'type' },
                    { label: 'Empresa/Planta', key: 'company' },
                    { label: 'Data Limite', key: 'deadline' },
                    { label: 'Status', key: 'status' },
                    { label: 'Valor', key: 'value', align: 'right' },
                  ].map((col) => (
                    <th 
                      key={col.key}
                      onClick={() => handleSort(col.key as keyof Order)}
                      className={`px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors ${col.align === 'right' ? 'text-right' : ''}`}
                    >
                      <div className={`flex items-center gap-2 ${col.align === 'right' ? 'justify-end' : ''}`}>
                        {col.label}
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                        ) : (
                          <ArrowUpDown size={12} className="opacity-30" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                            <Search size={32} />
                          </div>
                          <h3 className="text-sm font-semibold text-slate-900 mb-1">Nenhum pedido encontrado</h3>
                          <p className="text-xs text-slate-500 mb-4 max-w-sm">
                            Não conseguimos encontrar nenhum pedido correspondente aos filtros atuais.
                          </p>
                          <button 
                            onClick={() => { setSearch(''); setFilterType('all'); }}
                            className="text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline"
                          >
                            Limpar todos os filtros
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isOverdue = new Date(order.deadline) < new Date();
                      const isApproaching = !isOverdue && (new Date(order.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24) <= 7;

                      return (
                        <motion.tr 
                          layout
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                        >
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono text-blue-600 font-medium hover:underline">{order.number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-900">{order.title}</p>
                            <p className="text-[10px] text-slate-400">{order.department}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${order.type === 'SERVICE' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                              {order.type === 'SERVICE' ? <Briefcase size={14} /> : <Package size={14} />}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-700">{order.company}</span>
                              <span className="text-[10px] text-slate-500">{order.plant}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-start gap-1">
                              <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-rose-600 font-medium' : 'text-slate-600'}`}>
                                <CalendarClock size={12} className={isOverdue ? 'text-rose-500' : 'text-slate-400'} />
                                {new Date(order.deadline).toLocaleDateString('pt-BR')}
                              </div>
                              {isOverdue && <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">Atrasado</span>}
                              {isApproaching && <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Próximo</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm font-bold text-slate-900">{order.currency} {order.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-block">
                              <KebabMenu 
                                onCopy={() => console.log('Copiar', order.number)} 
                                onView={() => console.log('Visualizar', order.number)} 
                              />
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>Pág:</span>
                <select className="bg-white border border-slate-200 rounded px-1 py-0.5 focus:outline-none">
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
              <span>Mostrando 1 - {filteredOrders.length} de {STATS.totalOrders}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-1.5 border border-slate-200 rounded hover:bg-white disabled:opacity-50 transition-colors" disabled>
                <ChevronLeft size={14} />
              </button>
              <button className="p-1.5 border border-slate-200 rounded hover:bg-white transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Total Value Footer */}
        <div className="flex justify-end">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <ArrowUpRight size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Filtrado</p>
              <p className="text-xl font-bold text-slate-900">AOA {STATS.totalFilteredValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
