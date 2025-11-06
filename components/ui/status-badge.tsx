import { Badge } from './badge'
import { RequestStatus } from '@/lib/supabase/types'
import { REQUEST_STATUS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: RequestStatus
  className?: string
}

const colorClasses = {
  gray: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  amber: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  green: 'bg-green-100 text-green-800 hover:bg-green-100',
  red: 'bg-red-100 text-red-800 hover:bg-red-100',
  blue: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  emerald: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusInfo = REQUEST_STATUS[status]
  const colorClass = colorClasses[statusInfo.color]

  return (
    <Badge className={cn(colorClass, className)} variant="secondary">
      {statusInfo.label}
    </Badge>
  )
}

