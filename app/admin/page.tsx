import { getDashboardStats } from "./actions";
import { QrCode, Smartphone, Store, CheckCircle2 } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500">{label}</span>
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const totalClicks = stats.totalNfcClicks + stats.totalQrClicks;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Resumen general de tu red de soportes NFC/QR.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Stands activos" value={stats.activeStands} icon={CheckCircle2} />
        <StatCard label="Total de stands" value={stats.totalStands} icon={QrCode} />
        <StatCard label="Restaurantes" value={stats.totalRestaurants} icon={Store} />
        <StatCard label="Clics totales" value={totalClicks} icon={Smartphone} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-medium text-slate-700 mb-3">
            Clics por fuente
          </h2>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 text-slate-500">NFC</td>
                <td className="py-2 text-right font-medium">
                  {stats.totalNfcClicks}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-500">QR</td>
                <td className="py-2 text-right font-medium">
                  {stats.totalQrClicks}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-medium text-slate-700 mb-3">
            Interacciones por día (últimos 14 días)
          </h2>
          {stats.dailyBreakdown.length === 0 ? (
            <p className="text-sm text-slate-400">Aún no hay interacciones registradas.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-1.5 font-normal">Fecha</th>
                  <th className="py-1.5 font-normal text-right">NFC</th>
                  <th className="py-1.5 font-normal text-right">QR</th>
                  <th className="py-1.5 font-normal text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.dailyBreakdown.map((row) => (
                  <tr key={row.day} className="border-b border-slate-50">
                    <td className="py-1.5 text-slate-600">{row.day}</td>
                    <td className="py-1.5 text-right">{row.nfc}</td>
                    <td className="py-1.5 text-right">{row.qr}</td>
                    <td className="py-1.5 text-right font-medium">
                      {row.nfc + row.qr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
