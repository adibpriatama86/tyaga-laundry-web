import { useState } from 'react';
import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { ServiceWithPrices, TransactionFilters as Filters } from '../../types/models';
import { monthNames } from '../../utils/formatDate';
import { cn } from '../../utils/cn';
import { orderStatusLabels, paymentMethodLabels, paymentStatusLabels } from '../../utils/calculateTransaction';
import { serviceDisplayName } from '../../utils/serviceLabels';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface TransactionFiltersProps {
  filters: Filters;
  services: ServiceWithPrices[];
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export function TransactionFilters({ filters, services, onChange, onReset }: TransactionFiltersProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const years = Array.from({ length: 7 }, (_, index) => new Date().getFullYear() - 4 + index);

  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(260px,1.5fr)]">
        <Select
          label="Bulan"
          value={filters.month}
          onChange={(event) => onChange({ ...filters, month: Number(event.target.value) })}
        >
          {monthNames.map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </Select>
        <Select
          label="Tahun"
          value={filters.year}
          onChange={(event) => onChange({ ...filters, year: Number(event.target.value) })}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
        <div className="sm:col-span-2 lg:col-span-1">
          <Input
            label="Cari"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Cari nama, no nota, atau layanan"
          />
        </div>
      </div>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between rounded-lg border border-line bg-slate-50 px-3 py-2 text-sm font-semibold text-ink transition hover:bg-slate-100 lg:hidden"
        onClick={() => setAdvancedOpen((current) => !current)}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filter Lanjutan
        </span>
        <ChevronDown className={cn('h-4 w-4 text-muted transition', advancedOpen && 'rotate-180')} />
      </button>

      <div
        className={cn(
          'mt-3 gap-3 sm:grid-cols-2 xl:grid-cols-5',
          advancedOpen ? 'grid' : 'hidden',
          'lg:grid',
        )}
      >
        <Select
          label="Status pembayaran"
          value={filters.paymentStatus}
          onChange={(event) => onChange({ ...filters, paymentStatus: event.target.value as Filters['paymentStatus'] })}
        >
          <option value="all">Semua</option>
          <option value="paid">{paymentStatusLabels.paid}</option>
          <option value="unpaid">{paymentStatusLabels.unpaid}</option>
        </Select>
        <Select
          label="Metode pembayaran"
          value={filters.paymentMethod}
          onChange={(event) => onChange({ ...filters, paymentMethod: event.target.value as Filters['paymentMethod'] })}
        >
          <option value="all">Semua</option>
          <option value="cash">{paymentMethodLabels.cash}</option>
          <option value="qris">{paymentMethodLabels.qris}</option>
          <option value="bank_transfer">{paymentMethodLabels.bank_transfer}</option>
          <option value="not_selected">{paymentMethodLabels.not_selected}</option>
        </Select>
        <Select
          label="Jenis layanan"
          value={filters.serviceId}
          onChange={(event) => onChange({ ...filters, serviceId: event.target.value })}
        >
          <option value="all">Semua</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {serviceDisplayName(service.code, service.name)}
            </option>
          ))}
        </Select>
        <Select
          label="Status pesanan"
          value={filters.orderStatus}
          onChange={(event) => onChange({ ...filters, orderStatus: event.target.value as Filters['orderStatus'] })}
        >
          <option value="all">Semua</option>
          <option value="incoming">{orderStatusLabels.incoming}</option>
          <option value="process">{orderStatusLabels.process}</option>
          <option value="done">{orderStatusLabels.done}</option>
        </Select>
        <div className="grid grid-cols-[1fr_auto] items-end gap-2">
          <Select
            label="Urutkan"
            value={filters.sort}
            onChange={(event) => onChange({ ...filters, sort: event.target.value as Filters['sort'] })}
          >
            <option value="date_desc">Tanggal terbaru</option>
            <option value="date_asc">Tanggal terlama</option>
          </Select>
          <Button type="button" variant="secondary" size="icon" onClick={onReset} aria-label="Reset filter">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
