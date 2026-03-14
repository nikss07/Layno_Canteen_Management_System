export default function LoadingSpinner({ fullScreen = false, size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-5  h-5  border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
     
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full animate-spin`}
          style={{
            borderColor: 'rgba(249,115,22,0.15)',
            borderTopColor: '#f97316',
            boxShadow: '0 0 20px rgba(249,115,22,0.3)',
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"
            style={{ boxShadow: '0 0 8px rgba(249,115,22,0.8)' }} />
        </div>
      </div>
      {text && (
        <p className="text-sm font-semibold animate-pulse" style={{ color: 'var(--text-secondary)' }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 mesh-bg">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-12">{spinner}</div>;
}