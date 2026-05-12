import { CheckCircle2, Trash2, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface BulkActionBarProps {
  selectedCount: number;
  loading?: boolean;
  onMarkPaid: () => void;
  onMarkUnpaid: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActionBar({
  selectedCount,
  loading,
  onMarkPaid,
  onMarkUnpaid,
  onDelete,
  onClear,
}: BulkActionBarProps) {
  if (!selectedCount) return null;

  return (
    <div className="fixed inset-x-4 bottom-20 z-30 rounded-xl border border-line bg-white p-3 shadow-soft lg:sticky lg:bottom-auto lg:top-3 lg:mb-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm font-semibold text-ink">{selectedCount} transaksi dipilih</p>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button type="button" size="sm" variant="soft" loading={loading} onClick={onMarkPaid}>
            <CheckCircle2 className="h-4 w-4" />
            Tandai Lunas
          </Button>
          <Button type="button" size="sm" variant="secondary" loading={loading} onClick={onMarkUnpaid}>
            <XCircle className="h-4 w-4" />
            Belum Lunas
          </Button>
          <Button type="button" size="sm" variant="danger" loading={loading} onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Hapus
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onClear}>
            Batal
          </Button>
        </div>
      </div>
    </div>
  );
}
