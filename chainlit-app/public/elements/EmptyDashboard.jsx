function EmptyDashboard() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
      <svg
        className="h-12 w-12 mb-4 opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
      <h3 className="text-lg font-medium">Empty Now</h3>
      <p className="text-sm text-center max-w-xs mt-2 opacity-60">
        Ask about your accounts, transactions, or categories to see live data here.
      </p>
    </div>
  );
}

export default EmptyDashboard;
