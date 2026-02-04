// app/admin/layout.js
import AdminAuthWrapper from "/components/AdminAuthWrapper";

export default function AdminLayout({ children }) {
  return <AdminAuthWrapper>{children}</AdminAuthWrapper>;
}
