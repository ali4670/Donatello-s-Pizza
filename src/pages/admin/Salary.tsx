import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function AdminSalary() {
  const { orders } = useAdmin();
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  const years = useMemo(() => {
    const set = new Set<number>();
    orders.forEach((o) => set.add(new Date(o.createdAt).getFullYear()));
    set.add(now.getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [orders]);

  const monthlyOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });
  }, [orders, selectedYear, selectedMonth]);

  const monthlyStats = useMemo(() => {
    const delivered = monthlyOrders.filter((o) => o.status === 'delivered');
    const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
    const totalOrders = monthlyOrders.length;
    const deliveredCount = delivered.length;
    const cancelledCount = monthlyOrders.filter((o) => o.status === 'cancelled').length;
    const avgOrder = deliveredCount > 0 ? totalRevenue / deliveredCount : 0;
    return { totalRevenue, totalOrders, deliveredCount, cancelledCount, avgOrder };
  }, [monthlyOrders]);

  const yearlyStats = useMemo(() => {
    const yearOrders = orders.filter((o) => new Date(o.createdAt).getFullYear() === selectedYear);
    const delivered = yearOrders.filter((o) => o.status === 'delivered');
    return {
      totalRevenue: delivered.reduce((s, o) => s + o.total, 0),
      totalOrders: yearOrders.length,
      deliveredCount: delivered.length,
    };
  }, [orders, selectedYear]);

  const dailyBreakdown = useMemo(() => {
    const days: Record<number, { revenue: number; count: number }> = {};
    monthlyOrders.forEach((o) => {
      const day = new Date(o.createdAt).getDate();
      if (!days[day]) days[day] = { revenue: 0, count: 0 };
      days[day].count++;
      if (o.status === 'delivered') days[day].revenue += o.total;
    });
    return Object.entries(days)
      .map(([day, data]) => ({ day: Number(day), ...data }))
      .sort((a, b) => a.day - b.day);
  }, [monthlyOrders]);

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-podium text-white text-2xl sm:text-3xl uppercase tracking-tight">Salary</h1>
        <p className="text-amethyst-mauve/50 font-inter text-sm mt-1">Revenue tracking by month and year</p>
      </div>

      {/* Year selector */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-4 h-4 text-amethyst-lavender" />
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-amethyst-dark-2/60 border border-amethyst-royal/20 text-white font-inter text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-amethyst-lavender/40"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Yearly overview */}
      <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-5 mb-6">
        <h2 className="text-white font-inter text-xs tracking-[0.2em] uppercase font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amethyst-lavender" />
          {selectedYear} Overview
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-amethyst-lavender font-inter text-2xl font-bold">${yearlyStats.totalRevenue.toFixed(2)}</p>
            <p className="text-amethyst-mauve/50 font-inter text-xs uppercase tracking-wider mt-0.5">Total Revenue</p>
          </div>
          <div>
            <p className="text-white font-inter text-2xl font-bold">{yearlyStats.totalOrders}</p>
            <p className="text-amethyst-mauve/50 font-inter text-xs uppercase tracking-wider mt-0.5">Total Orders</p>
          </div>
          <div>
            <p className="text-green-400 font-inter text-2xl font-bold">{yearlyStats.deliveredCount}</p>
            <p className="text-amethyst-mauve/50 font-inter text-xs uppercase tracking-wider mt-0.5">Delivered</p>
          </div>
        </div>
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 text-amethyst-mauve/50 hover:text-amethyst-mauve transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-white font-inter font-semibold text-lg">{monthNames[selectedMonth]} {selectedYear}</h2>
        <button onClick={nextMonth} className="p-2 text-amethyst-mauve/50 hover:text-amethyst-mauve transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Monthly stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-4">
          <div className="w-8 h-8 rounded-lg bg-green-600/20 flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-amethyst-lavender font-inter text-xl font-bold">${monthlyStats.totalRevenue.toFixed(2)}</p>
          <p className="text-amethyst-mauve/50 font-inter text-[10px] uppercase tracking-wider">Revenue</p>
        </div>
        <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-4">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-white font-inter text-xl font-bold">{monthlyStats.totalOrders}</p>
          <p className="text-amethyst-mauve/50 font-inter text-[10px] uppercase tracking-wider">Orders</p>
        </div>
        <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-4">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-white font-inter text-xl font-bold">${monthlyStats.avgOrder.toFixed(2)}</p>
          <p className="text-amethyst-mauve/50 font-inter text-[10px] uppercase tracking-wider">Avg Order</p>
        </div>
        <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl p-4">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-red-400 font-inter text-xl font-bold">{monthlyStats.cancelledCount}</p>
          <p className="text-amethyst-mauve/50 font-inter text-[10px] uppercase tracking-wider">Cancelled</p>
        </div>
      </div>

      {/* Daily breakdown */}
      {dailyBreakdown.length > 0 && (
        <div className="bg-amethyst-dark-2/40 border border-amethyst-royal/15 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-amethyst-royal/10">
            <h2 className="text-white font-inter font-semibold text-sm">Daily Breakdown</h2>
          </div>
          <div className="divide-y divide-amethyst-royal/10">
            {dailyBreakdown.map((d) => (
              <div key={d.day} className="flex items-center justify-between px-5 py-3">
                <span className="text-amethyst-mauve/60 font-inter text-sm">{monthNames[selectedMonth]} {d.day}</span>
                <div className="flex items-center gap-4">
                  <span className="text-amethyst-mauve/40 font-inter text-xs">{d.count} order{d.count > 1 ? 's' : ''}</span>
                  <span className="text-amethyst-lavender font-inter text-sm font-bold">${d.revenue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dailyBreakdown.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <DollarSign className="w-12 h-12 text-amethyst-royal/30 mb-4" />
          <p className="text-amethyst-mauve/50 font-inter text-sm">No orders this month</p>
        </div>
      )}
    </div>
  );
}
