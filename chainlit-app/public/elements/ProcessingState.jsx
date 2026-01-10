function ProcessingState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
      <svg
        className="h-10 w-10 mb-4 animate-spin opacity-40"
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
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <p className="text-sm opacity-60">Processing...</p>
    </div>
  );
}

export default ProcessingState;
