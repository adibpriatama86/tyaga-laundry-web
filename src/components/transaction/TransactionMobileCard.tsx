import { CheckCircle2, Edit3, Trash2, XCircle } from 'lucide-react';
import type { LaundryTransaction } from '../../types/models';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { orderStatusLabels } from '../../utils/calculateTransaction';
import { serviceDisplayName } from '../../utils/serviceLabels';
import { Button } from '../ui/Button';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface TransactionMobileCardProps {
  transaction: LaundryTransaction;
  selected: boolean;
  onToggle: (id: string) => void;
  onEdit: (transaction: LaundryTransaction) => void;
  onDelete: (transaction: LaundryTransaction) => void;
  onMarkPaid: (transaction: LaundryTransaction) => void;
  onMarkUnpaid: (transaction: LaundryTransaction) => void;
}

export function TransactionMobileCard({
  transaction,
  selected,
  onToggle,
  onEdit,
  onDelete,
  onMarkPaid,
  onMarkUnpaid,
}: TransactionMobileCardProps) {
  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-sm lg:hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-primary">{transaction.receipt_number || 'Tanpa nomor nota'}</p>
          <h3 className="mt-1 font-bold text-ink">{transaction.customer_name_snapshot}</h3>
          <p className="text-sm text-muted">{formatDate(transaction.date_in)}</p>
        </div>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(transaction.id)}
          aria-label={`Pilih ${transaction.receipt_number}`}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted">Layanan</p>
          <p className="font-semibold text-ink">
            {serviceDisplayName(transaction.service_code_snapshot, transaction.service_name_snapshot)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Berat/Jumlah</p>
          <p className="font-semibold text-ink">
            {transaction.quantity} {transaction.unit_type_snapshot}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Total</p>
          <p className="font-bold text-ink">{formatCurrency(transaction.total_price)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Pembayaran</p>
          <PaymentStatusBadge status={transaction.payment_status} />
        </div>
      </div>

      {transaction.notes ? <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-muted">{transaction.notes}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <PaymentMethodBadge method={transaction.payment_method} />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-muted">
          Pesanan: {orderStatusLabels[transaction.order_status]}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(transaction)} title="Edit">
          <Edit3 className="h-4 w-4" />
          Edit
        </Button>
        {transaction.payment_status === 'paid' ? (
          <Button type="button" variant="secondary" size="sm" onClick={() => onMarkUnpaid(transaction)} title="Tandai Belum Lunas">
            <XCircle className="h-4 w-4" />
            Belum
          </Button>
        ) : (
          <Button type="button" variant="soft" size="sm" onClick={() => onMarkPaid(transaction)} title="Tandai Lunas">
            <CheckCircle2 className="h-4 w-4" />
            Lunas
          </Button>
        )}
        <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(transaction)} title="Hapus">
          <Trash2 className="h-4 w-4 text-red-600" />
          Hapus
        </Button>
      </div>
    </article>
  );
}
