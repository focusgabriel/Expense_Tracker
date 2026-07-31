/** @format */

type OfflineStatusProps = {
  isOffline: boolean;
  message?: string;
};

const OfflineStatus = ({ isOffline, message }: OfflineStatusProps) => {
  if (!isOffline) {
    return null;
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 shadow-sm">
      {message ||
        "Offline mode is active. Your changes are saved locally and will sync when you're back online."}
    </div>
  );
};

export default OfflineStatus;
