import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // La protección de sesión real (redirigir a /admin/login si no hay
  // usuario) se hace en middleware.ts para cubrir TODAS las rutas /admin,
  // incluida esta capa de layout, antes de renderizar nada.
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminNav />
      <main className="flex-1 p-4 md:p-8 max-w-6xl">{children}</main>
    </div>
  );
}
