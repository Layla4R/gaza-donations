// Admin area: no site Header/Footer, LTR English layout
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="ltr" className="min-h-screen bg-dashbg font-sans">
      {children}
    </div>
  );
}
