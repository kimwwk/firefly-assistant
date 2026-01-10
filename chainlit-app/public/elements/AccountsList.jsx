import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Wallet,
  Building2,
  PiggyBank,
  Landmark,
  FileText,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  Hash,
  Globe,
  Banknote
} from "lucide-react"

// Map account types to icons
const accountTypeIcons = {
  "asset": Landmark,
  "expense": TrendingDown,
  "revenue": TrendingUp,
  "cash": Wallet,
  "checking": Landmark,
  "savings": PiggyBank,
  "credit": CreditCard,
  "creditcard": CreditCard,
  "loan": FileText,
  "debt": FileText,
  "mortgage": Building2,
  "investment": TrendingUp,
  "default": Wallet,
}

function formatCurrency(amount, symbol = "$", decimals = 2) {
  const num = parseFloat(amount) || 0
  const formatted = Math.abs(num).toFixed(decimals)
  const prefix = num < 0 ? "-" : ""
  return `${prefix}${symbol}${formatted}`
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

function AccountCard({ account }) {
  const attrs = account.attributes || {}
  const Icon = accountTypeIcons[attrs.type] || accountTypeIcons.default
  const balance = parseFloat(attrs.current_balance) || 0
  const isNegative = balance < 0

  return (
    <Card className="mb-3">
      <CardContent className="pt-4">
        {/* Header: Icon, Name, Type */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <Icon className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base truncate">{attrs.name}</h3>
              {!attrs.active && (
                <Badge variant="secondary" className="text-xs">Inactive</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs capitalize">{attrs.type}</Badge>
              {attrs.account_role && (
                <Badge variant="outline" className="text-xs">{attrs.account_role}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-muted/50 rounded-lg p-3 mb-3">
          <div className="text-xs text-muted-foreground mb-1">Current Balance</div>
          <div className={`text-2xl font-bold ${isNegative ? "text-red-600" : "text-green-600"}`}>
            {formatCurrency(balance, attrs.currency_symbol, attrs.currency_decimal_places)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {attrs.currency_name} ({attrs.currency_code})
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {attrs.account_number && (
            <div className="flex items-center gap-2">
              <Hash className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground">Account:</span>
              <span className="truncate">{attrs.account_number}</span>
            </div>
          )}
          {attrs.iban && (
            <div className="flex items-center gap-2 col-span-2">
              <Globe className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground">IBAN:</span>
              <span className="truncate font-mono text-xs">{attrs.iban}</span>
            </div>
          )}
          {attrs.bic && (
            <div className="flex items-center gap-2">
              <Building2 className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground">BIC:</span>
              <span>{attrs.bic}</span>
            </div>
          )}
          {attrs.opening_balance && (
            <div className="flex items-center gap-2">
              <Banknote className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground">Opening:</span>
              <span>{formatCurrency(attrs.opening_balance, attrs.currency_symbol)}</span>
            </div>
          )}
          {attrs.virtual_balance && attrs.virtual_balance !== "0" && (
            <div className="flex items-center gap-2">
              <TrendingUp className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground">Virtual:</span>
              <span>{formatCurrency(attrs.virtual_balance, attrs.currency_symbol)}</span>
            </div>
          )}
          {attrs.credit_card_type && (
            <div className="flex items-center gap-2">
              <CreditCard className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground">Card Type:</span>
              <span className="capitalize">{attrs.credit_card_type}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {attrs.notes && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-start gap-2">
              <Info className="size-3 text-muted-foreground mt-1" />
              <p className="text-sm text-muted-foreground">{attrs.notes}</p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="mt-3 pt-3 border-t flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>Updated: {formatDate(attrs.updated_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AccountsList() {
  const accounts = props.data?.data || []
  const pagination = props.data?.meta?.pagination || {}
  const total = pagination.total || accounts.length

  // Calculate totals by currency
  const totals = {}
  accounts.forEach(acc => {
    const attrs = acc.attributes || {}
    if (attrs.active !== false) {
      const currency = attrs.currency_code || "USD"
      const symbol = attrs.currency_symbol || "$"
      const balance = parseFloat(attrs.current_balance) || 0
      if (!totals[currency]) {
        totals[currency] = { sum: 0, symbol }
      }
      totals[currency].sum += balance
    }
  })

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No accounts found.</p>
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
            <span>Accounts</span>
            <Badge variant="secondary">{total} total</Badge>
          </CardTitle>
          {pagination.total > accounts.length && (
            <p className="text-xs text-muted-foreground">
              Showing {accounts.length} of {pagination.total}
            </p>
          )}
        </CardHeader>
        {Object.keys(totals).length > 0 && (
          <CardContent className="pt-0">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-2">Net Worth</div>
              {Object.entries(totals).map(([currency, data]) => (
                <div key={currency} className="flex items-center justify-between">
                  <span className="text-sm">{currency}</span>
                  <span className={`font-bold ${data.sum < 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(data.sum, data.symbol)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Account cards */}
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}
