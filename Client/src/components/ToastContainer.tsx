// /** @format */

// import Notification from "./Notification";

// export interface Toast {
//   id: string;
//   message: string;
//   type: "success" | "error" | "info" | "warning";
// }

// interface ToastContainerProps {
//   toasts: Toast[];
//   removeToast: (id: string) => void;
// }

// const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
//   if (toasts.length === 0) return null;

//   return (
//     <div className="fixed right-4 top-4 z-[9999] flex max-w-sm flex-col gap-2 sm:right-6 sm:top-6">
//       {toasts.map(toast => (
//         <Notification
//           key={toast.id}
//           message={toast.message}
//           type={toast.type}
//           onClose={() => removeToast(toast.id)}
//         />
//       ))}
//     </div>
//   );
// };

// export default ToastContainer;
