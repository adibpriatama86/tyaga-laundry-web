import type { PaymentStatus } from '../../types/models';
import { paymentStatusLabels } from '../../utils/calculateTransaction';
import { Badge } from '../ui/Badge';

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={status === 'paid' ? 'green' : 'amber'}>{paymentStatusLabels[status]}</Badge>;
}
