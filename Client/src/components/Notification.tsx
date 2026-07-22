// /** @format */

// import { useEffect, useState, type JSX } from "react";
// import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

// type NotificationType = "success" | "error" | "info" | "warning";

// interface NotificationProps {
//   message: string;
//   type?: NotificationType;
//   onClose: () => void;
//   duration?: number;
// }

// const ICONS: Record<NotificationType, JSX.Element> = {
//   success: <CheckCircle size={18} className="text-emerald-500" />,
//   error: <AlertCircle size={18} className="text-rose-500" />,
//   info: <Info size={18} className="text-indigo-500" />,
//   warning: <AlertTriangle size={18} className="text-amber-500" />,
// };

// const BG_CLASSES: Record<NotificationType, string> = {
//   success: "border-emerald-200 bg-emerald-50 shadow-emerald-200/40",
//   error: "border-rose-200 bg-rose-50 shadow-rose-200/40",
//   info: "border-indigo-200 bg-indigo-50 shadow-indigo-200/40",
//   warning: "border-amber-200 bg-amber-50 shadow-amber-200/40",
// };

// const Notification = ({
//   message,
//   type = "error",
//   onClose,
//   duration = 5000,
// }: NotificationProps) => {
//   const [exiting, setExiting] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setExiting(true);
//       setTimeout(onClose, 200);
//     }, duration);
//     return () => clearTimeout(timer);
//   }, [duration, onClose]);

//   const handleClose = () => {
//     setExiting(true);
//     setTimeout(onClose, 200);
//   };

//   return (
//     <div
//       className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-lg backdrop-blur-sm transition-all duration-200 ${BG_CLASSES[type]} ${
//         exiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
//       }`}
//       role="alert"
//     >
//       <span className="mt-0.5 shrink-0">{ICONS[type]}</span>
//       <p className="flex-1 text-sm font-medium text-slate-800">{message}</p>
//       <button
//         onClick={handleClose}
//         className="mt-0.5 shrink-0 rounded-lg p-0.5 text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600"
//         aria-label="Close notification"
//       >
//         <X size={16} />
//       </button>
//     </div>
//   );
// };

// export default Notification;
