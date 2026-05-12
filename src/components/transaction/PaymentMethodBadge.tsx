import type { PaymentMethod } from '../../types/models';
import { paymentMethodLabels } from '../../utils/calculateTransaction';
import { Badge } from '../ui/Badge';

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const variant = method === 'not_selected' ? 'slate' : method === 'qris' ? 'sky' : method === 'bank_transfer' ? 'blue' : 'green';
  return <Badge variant={variant}>{paymentMethodLabels[method]}</Badge>;
}
