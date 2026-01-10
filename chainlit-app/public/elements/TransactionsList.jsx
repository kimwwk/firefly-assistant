import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Calendar,
  Tag,
  Folder,
  FileText,
  Repeat,
  CheckCircle2,
  Circle,
  Paperclip,
  ExternalLink,
  Building2,
  Wallet
} from "lucide-react"

// Transaction type config
const txTypeConfig = {
  deposit: {
    icon: ArrowDownLeft,
    label: "Income",
    colorClass: "text-green-600",
    bgClass: "bg-green-100 dark:bg-green-900/30",
    sign: "+"
  },
  withdrawal: {
    icon: ArrowUpRight,
    label: "Expense",
    colorClass: "text-red-600",
    bgClass: "bg-red-100 dark:bg-red-900/30",
    sign: "-"
  },
  transfer: {
    icon: ArrowLeftRight,
    label: "Transfer",
    colorClass: "text-blue-600",
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    sign: ""
  },
  "opening balance": {
    icon: Wallet,
    label: "Opening",
    colorClass: "text-purple-600",
    bgClass: "bg-purple-100 dark:bg-purple-900/30",
    sign: ""
  },
  reconciliation: {
    icon: CheckCircle2,
    label: "Reconciliation",
    colorClass: "text-gray-600",
    bgClass: "bg-gray-100 dark:bg-gray-900/30",
    sign: ""
  }
}

function formatCurrency(amount, symbol = "$", decimals = 2) {
  const num = parseFloat(amount) || 0
  return `${symbol}${Math.abs(num).toFixed(decimals)}`
}

function formatDate(dateStr) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return "Today"
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday"

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined
  })
}

function formatFullDate(dateStr) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

function TransactionCard({ transaction }) {
  const attrs = transaction.attributes || {}
  const txList = attrs.transactions || []

  // For now, show the first transaction (handle splits later)
  const tx = txList[0] || {}
  const config = txTypeConfig[tx.type] || txTypeConfig.withdrawal
  const Icon = config.icon

  const amount = parseFloat(tx.amount) || 0
  const hasforeign = tx.foreign_amount && tx.foreign_currency_code

  return (
    <Card className="mb-3">
      <CardContent className="pt-4">
        {/* Header: Icon, Description, Amount */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${config.bgClass}`}>
            <Icon className={`size-5 ${config.colorClass}`} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base truncate">
                  {tx.description || "No description"}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>{formatDate(tx.date)}</span>
                  <Badge variant="outline" className={`text-xs ${config.colorClass}`}>
                    {config.label}
                  </Badge>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0">
                <p className={`font-bold text-lg ${config.colorClass}`}>
                  {config.sign}{formatCurrency(amount, tx.currency_symbol, tx.currency_decimal_places)}
                </p>
                {hasforeign && (
                  <p className="text-xs text-muted-foreground">
                    ({tx.foreign_currency_symbol}{parseFloat(tx.foreign_amount).toFixed(2)})
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Flow: Source → Destination */}
        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Building2 className="size-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{tx.source_name}</p>
                <p className="text-xs text-muted-foreground">{tx.source_type}</p>
              </div>
            </div>
            <ArrowLeftRight className="size-4 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end text-right">
              <div className="min-w-0">
                <p className="font-medium truncate">{tx.destination_name}</p>
                <p className="text-xs text-muted-foreground">{tx.destination_type}</p>
              </div>
              <Wallet className="size-4 text-muted-foreground shrink-0" />
            </div>
          </div>
        </div>

        {/* Metadata: Category, Budget, Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tx.category_name && (
            <Badge variant="secondary" className="text-xs">
              <Folder className="size-3 mr-1" />
              {tx.category_name}
            </Badge>
          )}
          {tx.budget_name && (
            <Badge variant="secondary" className="text-xs">
              <FileText className="size-3 mr-1" />
              {tx.budget_name}
            </Badge>
          )}
          {tx.bill_name && (
            <Badge variant="secondary" className="text-xs">
              <Repeat className="size-3 mr-1" />
              {tx.bill_name}
            </Badge>
          )}
          {tx.tags && tx.tags.length > 0 && tx.tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              <Tag className="size-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Status indicators */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {tx.reconciled ? (
              <CheckCircle2 className="size-3 text-green-600" />
            ) : (
              <Circle className="size-3" />
            )}
            <span>{tx.reconciled ? "Reconciled" : "Not reconciled"}</span>
          </div>
          {tx.has_attachments && (
            <div className="flex items-center gap-1">
              <Paperclip className="size-3" />
              <span>Has attachments</span>
            </div>
          )}
          {tx.external_url && (
            <div className="flex items-center gap-1">
              <ExternalLink className="size-3" />
              <span>External link</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {tx.notes && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground">{tx.notes}</p>
          </div>
        )}

        {/* Split transactions indicator */}
        {txList.length > 1 && (
          <div className="mt-3 pt-3 border-t">
            <Badge variant="outline" className="text-xs">
              Split transaction ({txList.length} parts)
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function TransactionsList() {
  const transactions = props.data?.data || []
  const pagination = props.data?.meta?.pagination || {}
  const total = pagination.total || transactions.length

  // Calculate summary
  let totalIncome = 0
  let totalExpense = 0
  let currency = "CAD"
  let symbol = "$"

  transactions.forEach(t => {
    const tx = t.attributes?.transactions?.[0]
    if (tx) {
      currency = tx.currency_code || currency
      symbol = tx.currency_symbol || symbol
      const amount = parseFloat(tx.amount) || 0
      if (tx.type === "deposit") totalIncome += amount
      if (tx.type === "withdrawal") totalExpense += amount
    }
  })

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No transactions found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Transactions</span>
            <Badge variant="secondary">{total} total</Badge>
          </CardTitle>
          {pagination.total > transactions.length && (
            <p className="text-xs text-muted-foreground">
              Showing {transactions.length} of {pagination.total}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="text-xs text-muted-foreground">Income</div>
              <div className="text-lg font-bold text-green-600">
                +{formatCurrency(totalIncome, symbol)}
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
              <div className="text-xs text-muted-foreground">Expenses</div>
              <div className="text-lg font-bold text-red-600">
                -{formatCurrency(totalExpense, symbol)}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <span className="text-sm font-medium">Net</span>
            <span className={`font-bold ${(totalIncome - totalExpense) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {(totalIncome - totalExpense) >= 0 ? "+" : ""}{formatCurrency(totalIncome - totalExpense, symbol)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Transaction cards */}
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  )
}
