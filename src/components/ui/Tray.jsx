// Rounded grey panel with a faint grid that holds paper cards.
export default function Tray({ children, className = "", ref, ...props }) {
  return (
    <div ref={ref} className={`tray p-3 sm:p-4 md:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
