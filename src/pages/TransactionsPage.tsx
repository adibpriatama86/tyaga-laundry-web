import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Download, PlusCircle } from 'lucide-react';
import type { LaundryTransaction, TransactionFilters as Filters } from '../types/models';
import { useBusinessAccess } from '../hooks/useBusinessAccess';
import { useServices } from '../hooks/useServices';
import { useTransactions, useTransactionMutations } from '../hooks/useTransactions';
import { getCurrentMonthYear } from '../utils/formatDate';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { BulkActionBar } from '../components/transaction/BulkActionBar';
import { TransactionFilters } from '../components/transaction/TransactionFilters';
import { TransactionForm } from '../components/transaction/TransactionForm';
import { TransactionMobileCard } from '../components/transaction/TransactionMobileCard';
import { TransactionTable } from '../components/transaction/TransactionTable';

const pageSize = 20;

function defaultFilters(paymentParam?: string | null): Filters {
  const { month, year } = getCurrentMonthYear();
  return {
    month,
    year,
    paymentStatus: paymentParam === 'unpaid' ? 'unpaid' : 'all',
    paymentMethod: 'all',
    orderStatus: 'all',
    serviceId: 'all',
    search: '',
    sort: 'date_desc',
  };
}

export function TransactionsPage() {
  const [searchParams] = useSearchParams();
  const { businessId } = useBusinessAccess();
  const services = useServices(businessId);
  const [filters, setFilters] = useState<Filters>(() => defaultFilters(searchParams.get('payment')));
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editing, setEditing] = useState<LaundryTransaction | null>(null);
  const [editSaved, setEditSaved] = useState(false);
  const [deleteIds, setDeleteIds] = useState<string[] | null>(null);
  const { showToast } = useToast();

  const transactions = useTransactions(businessId, filters, page, pageSize);
  const mutations = useTransactionMutations(businessId, services.data ?? []);

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [filters]);

  useEffect(() => {
    if (searchParams.get('payment') === 'unpaid') {
      setFilters((current) => ({ ...current, paymentStatus: 'unpaid' }));
    }
  }, [searchParams]);

  const rows = transactions.data?.transactions ?? [];
  const totalPages = Math.max(1, Math.ceil((transactions.data?.count ?? 0) / pageSize));
  const selectedOnPage = rows.filter((row) => selectedIds.includes(row.id)).length;

  const resetFilters = () => setFilters(defaultFilters());

  const beginEdit = (transaction: LaundryTransaction) => {
    setEditSaved(false);
    setEditing(transaction);
  };

  const finishEdit = () => {
    setEditing(null);
    setEditSaved(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAll = () => {
    if (selectedOnPage === rows.length) {
      setSelectedIds((current) => current.filter((id) => !rows.some((row) => row.id === id)));
      return;
    }
    setSelectedIds((current) => Array.from(new Set([...current, ...rows.map((row) => row.id)])));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const markPayment = async (ids: string[], status: 'paid' | 'unpaid') => {
    await mutations.updatePaymentStatus.mutateAsync({ ids, status });
    setSelectedIds([]);
    showToast('Status pembayaran berhasil diperbarui.');
  };

  const deleteSelected = async () => {
    if (!deleteIds?.length) return;
    await mutations.deleteTransactions.mutateAsync(deleteIds);
    setSelectedIds((current) => current.filter((id) => !deleteIds.includes(id)));
    setDeleteIds(null);
    showToast(deleteIds.length > 1 ? 'Transaksi terpilih berhasil dihapus.' : 'Transaksi berhasil dihapus.');
  };

  const loadingAction = mutations.deleteTransactions.isPending || mutations.updatePaymentStatus.isPending;

  const content = useMemo(() => {
    if (transactions.isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      );
    }

    if (transactions.isError) return <EmptyState title="Data gagal dimuat. Coba refresh halaman." />;

    if (!rows.length) {
      return (
        <EmptyState
          title="Belum ada transaksi sesuai filter"
          description="Coba ubah bulan, status pembayaran, atau kata kunci pencarian."
        />
      );
    }

    return (
      <>
        <TransactionTable
          transactions={rows}
          selectedIds={selectedIds}
          onToggle={toggleOne}
          onToggleAll={toggleAll}
          onEdit={beginEdit}
          onDelete={(transaction) => setDeleteIds([transaction.id])}
          onMarkPaid={(transaction) => void markPayment([transaction.id], 'paid')}
          onMarkUnpaid={(transaction) => void markPayment([transaction.id], 'unpaid')}
        />
        <div className="space-y-3 lg:hidden">
          {rows.map((transaction) => (
            <TransactionMobileCard
              key={transaction.id}
              transaction={transaction}
              selected={selectedIds.includes(transaction.id)}
              onToggle={toggleOne}
              onEdit={beginEdit}
              onDelete={(item) => setDeleteIds([item.id])}
              onMarkPaid={(item) => void markPayment([item.id], 'paid')}
              onMarkUnpaid={(item) => void markPayment([item.id], 'unpaid')}
            />
          ))}
        </div>
      </>
    );
  }, [rows, selectedIds, transactions.isError, transactions.isLoading]);

  if (!businessId) return null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Rekap bulanan</p>
          <h1 className="text-2xl font-bold text-ink lg:text-3xl">Rekap Transaksi</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/transactions/new">
            <Button>
              <PlusCircle className="h-5 w-5" />
              Tambah
            </Button>
          </Link>
          <Link to="/monthly-report">
            <Button variant="secondary">
              <Download className="h-5 w-5" />
              Export Rekap
            </Button>
          </Link>
        </div>
      </div>

      {editSaved ? (
        <Card className="border-emerald-100 bg-emerald-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-800">Perubahan transaksi berhasil disimpan.</p>
                <p className="text-sm text-emerald-700">Data rekap sudah diperbarui.</p>
              </div>
            </div>
            <Button type="button" variant="secondary" onClick={() => setEditSaved(false)}>
              Kembali ke Rekap
            </Button>
          </div>
        </Card>
      ) : null}

      <TransactionFilters
        filters={filters}
        services={services.data ?? []}
        onChange={setFilters}
        onReset={resetFilters}
      />

      <BulkActionBar
        selectedCount={selectedIds.length}
        loading={loadingAction}
        onMarkPaid={() => void markPayment(selectedIds, 'paid')}
        onMarkUnpaid={() => void markPayment(selectedIds, 'unpaid')}
        onDelete={() => setDeleteIds(selectedIds)}
        onClear={() => setSelectedIds([])}
      />

      {content}

      {rows.length ? (
        <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            Halaman {page} dari {totalPages} · {transactions.data?.count ?? 0} transaksi
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Sebelumnya
            </Button>
            <Button type="button" variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
              Berikutnya
            </Button>
          </div>
        </div>
      ) : null}

      <Modal open={!!editing} title="Edit Transaksi" onClose={() => setEditing(null)} className="sm:max-w-5xl">
        {editing ? (
          <TransactionForm
            businessId={businessId}
            services={services.data ?? []}
            mode="edit"
            transaction={editing}
            onSuccess={finishEdit}
          />
        ) : null}
      </Modal>

      <ConfirmDialog
        open={!!deleteIds?.length}
        title="Hapus transaksi?"
        description="Data transaksi yang dihapus tidak bisa dikembalikan."
        confirmLabel="Hapus Data"
        loading={mutations.deleteTransactions.isPending}
        onConfirm={() => void deleteSelected()}
        onCancel={() => setDeleteIds(null)}
      />
    </div>
  );
}
