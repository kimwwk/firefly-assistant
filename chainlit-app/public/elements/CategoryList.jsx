import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Folder,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Calendar
} from "lucide-react"

function formatCurrency(amount, symbol = "$") {
  if (!amount) return null
  const num = parseFloat(amount) || 0
  return `${symbol}${Math.abs(num).toFixed(2)}`
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

function CategoryCard({ category }) {
  const attrs = category.attributes || {}
  const symbol = attrs.primary_currency_symbol || "$"

  const spent = parseFloat(attrs.spent) || 0
  const earned = parseFloat(attrs.earned) || 0
  const transferred = parseFloat(attrs.transferred) || 0

  const hasStats = spent > 0 || earned > 0 || transferred > 0

  return (
    <Card className="mb-3">
      <CardContent className="pt-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <Folder className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base">{attrs.name}</h3>
            {attrs.notes && (
              <p className="text-sm text-muted-foreground mt-1">{attrs.notes}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        {hasStats && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {earned > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                <TrendingUp className="size-4 text-green-600 mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">Earned</div>
                <div className="text-sm font-bold text-green-600">
                  {formatCurrency(earned, symbol)}
                </div>
              </div>
            )}
            {spent > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 text-center">
                <TrendingDown className="size-4 text-red-600 mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">Spent</div>
                <div className="text-sm font-bold text-red-600">
                  {formatCurrency(spent, symbol)}
                </div>
              </div>
            )}
            {transferred > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
                <ArrowLeftRight className="size-4 text-blue-600 mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">Transferred</div>
                <div className="text-sm font-bold text-blue-600">
                  {formatCurrency(transferred, symbol)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>Updated: {formatDate(attrs.updated_at)}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {attrs.primary_currency_code}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CategoryList() {
  const categories = props.data?.data || []
  const pagination = props.data?.meta?.pagination || {}
  const total = pagination.total || categories.length

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No categories found.</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate totals
  let totalEarned = 0
  let totalSpent = 0
  let symbol = "$"

  categories.forEach(cat => {
    const attrs = cat.attributes || {}
    symbol = attrs.primary_currency_symbol || symbol
    totalEarned += parseFloat(attrs.earned) || 0
    totalSpent += parseFloat(attrs.spent) || 0
  })

  const hasStats = totalEarned > 0 || totalSpent > 0

  return (
    <div className="space-y-4">
      {/* Header with summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Categories</span>
            <Badge variant="secondary">{total} total</Badge>
          </CardTitle>
          {pagination.total > categories.length && (
            <p className="text-xs text-muted-foreground">
              Showing {categories.length} of {pagination.total}
            </p>
          )}
        </CardHeader>
        {hasStats && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Total Earned</div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(totalEarned, symbol)}
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Total Spent</div>
                <div className="text-lg font-bold text-red-600">
                  {formatCurrency(totalSpent, symbol)}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Category cards */}
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}
