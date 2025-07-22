import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Loader } from "lucide-react"
import type { ReactNode, MouseEvent } from "react"

interface ActionTableProps {
  className?: string
  id?: string
  disabled?: boolean
  loading?: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  icon: ReactNode
  tooltipText: string
}

export function ActionTable({
  className,
  onClick,
  id,
  icon,
  tooltipText,
  disabled = false,
  loading = false,
}: ActionTableProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {loading ? <Loader /> : <Button  className={className} id={id} variant="link" disabled={disabled} onClick={onClick}>{icon}</Button>}
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  )
}
