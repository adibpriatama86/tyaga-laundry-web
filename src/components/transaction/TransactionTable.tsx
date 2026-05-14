import { CheckCircle2, Edit3, Trash2, XCircle } from 'lucide-react';
import type { LaundryTransaction } from '../../types/models';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { orderStatusLabels } from '../../utils/calculateTransaction';
import { serviceDisplayName } from '../../utils/serviceLabels';
import { Button } from '../ui/Button';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface TransactionTableProps {
  transactions: LaundryTransaction[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onEdit: (transaction: LaundryTransaction) => void;
  onDelete: (transaction: LaundryTransaction) => void;
  onMarkPaid: (transaction: LaundryTransaction) => void;
  onMarkUnpaid: (transaction: LaundryTransaction) => void;
}

export function TransactionTable({
  transactions,
  selectedIds,
  onToggle,
  onToggleAll,
  onEdit,
  onDelete,
  onMarkPaid,
  onMarkUnpaid,
}: TransactionTableProps) {
  const allSelected = transactions.length > 0 && selectedIds.length === transactions.length;

  return (
    <div className="hidden overflow-hidden rounded-lg border border-line bg-white shadow-sm lg:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" checked={allSelected} onChange={onToggleAll} aria-label="Pilih semua" />
              </th>
              <th className="w-40 px-4 py-3">Nota</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="min-w-44 px-4 py-3">Layanan</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Pembayaran</th>
              <th className="px-4 py-3">Pesanan</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="align-top transition hover:bg-slate-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(transaction.id)}
                    onChange={() => onToggle(transaction.id)}
                    aria-label={`Pilih ${transaction.receipt_number}`}
                  />
                </td>
                <td className="w-40 px-4 py-3 font-semibold text-ink">{transaction.receipt_number || '-'}</td>
                <td className="px-4 py-3 text-muted">{formatDate(transaction.date_in)}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{transaction.customer_name_snapshot}</p>
                  <p className="text-xs text-muted">{transaction.customer_phone_snapshot || '-'}</p>
                </td>
                <td className="min-w-44 px-4 py-3 text-muted">
                  {serviceDisplayName(transaction.service_code_snapshot, transaction.service_name_snapshot)}
                </td>
                <td className="px-4 py-3 text-muted">
                  {transaction.quantity} {transaction.unit_type_snapshot}
                </td>
                <td className="px-4 py-3 font-bold text-ink">{formatCurrency(transaction.total_price)}</td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <PaymentStatusBadge status={transaction.payment_status} />
                    <PaymentMethodBadge method={transaction.payment_method} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-muted">
                    {orderStatusLabels[transaction.order_status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(transaction)} aria-label="Edit" title="Edit">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    {transaction.payment_status === 'paid' ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onMarkUnpaid(transaction)}
                        aria-label="Tandai belum lunas"
                        title="Tandai Belum Lunas"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onMarkPaid(transaction)}
                        aria-label="Tandai lunas"
                        title="Tandai Lunas"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(transaction)} aria-label="Hapus" title="Hapus">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
