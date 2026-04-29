import { useEffect, useState } from "react";
import { 
  getTalents, 
  deleteTalent, 
  updateTalent, 
  getTalentStats,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from "../services/api";
import { Card, CardContent } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { 
  Trash2, Search, LayoutGrid, List, LogOut, User, Briefcase, Zap, 
  Settings, BarChart3, Bell, Menu, Users, Clock, CheckCircle2, 
  TrendingUp, ShieldCheck 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminDashboard() {
  const [talents, setTalents] = useState([]);
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, active, inactive
  const { logout, user } = useAuth();
  const [viewMode, setViewMode] = useState("table");
  const [activeTab, setActiveTab] = useState("talents"); // talents, analytics, settings

  const fetchTalents = async () => {
    try {
      setLoading(true);
      const res = await getTalents({ search, status: statusFilter });
      setTalents(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load talents");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getTalentStats();
      setStats(res.data.data);
    } catch (err) {
      console.error("Stats error:", err);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.data);
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Read error:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success("All caught up!");
    } catch (err) {
      console.error("Read all error:", err);
    }
  };

  useEffect(() => {
    const initNotifications = async () => {
      await fetchNotifications();
    };
    
    initNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (activeTab === "talents") {
        await fetchTalents();
      } else if (activeTab === "analytics") {
        await fetchStats();
      }
    };

    if (activeTab === "talents") {
      const timeoutId = setTimeout(loadData, 300);
      return () => clearTimeout(timeoutId);
    } else {
      loadData();
    }
  }, [search, statusFilter, activeTab]);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this record? This action cannot be undone.")) return;
    try {
      await deleteTalent(id);
      setTalents(talents.filter((t) => t._id !== id));
      toast.success("Record removed");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "inactive" ? "active" : "inactive";
    try {
      await updateTalent(id, { status: newStatus });
      setTalents(talents.map(t => t._id === id ? { ...t, status: newStatus } : t));
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Update failed");
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateTalent(id, { status: "active" });
      setTalents(talents.map(t => t._id === id ? { ...t, status: "active" } : t));
      toast.success("Application approved");
    } catch (err) {
      console.error("Approval error:", err);
      toast.error("Approval failed");
    }
  };

  return (
    <div className="min-h-screen bg-light-bg-secondary flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="p-6">
           <div className="flex items-center gap-2.5 mb-10">
              <div className="bg-primary p-1.5 rounded-lg">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-text-primary tracking-tight">Talentry Admin</span>
           </div>
           
           <nav className="space-y-1">
              <SidebarLink 
                icon={Briefcase} 
                label="Talents" 
                active={activeTab === "talents"} 
                onClick={() => setActiveTab("talents")} 
              />
              <SidebarLink 
                icon={BarChart3} 
                label="Analytics" 
                active={activeTab === "analytics"} 
                onClick={() => setActiveTab("analytics")} 
              />
              <SidebarLink 
                icon={Settings} 
                label="Settings" 
                active={activeTab === "settings"} 
                onClick={() => setActiveTab("settings")} 
              />
           </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-50">
           <button 
             onClick={logout}
             className="w-full flex items-center gap-2 text-text-secondary hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest"
           >
              <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center gap-4 lg:hidden">
              <button className="p-2 text-text-secondary hover:bg-slate-50 rounded-lg">
                 <Menu className="w-5 h-5" />
              </button>
              <div className="bg-primary p-1 rounded-lg">
                 <Zap className="w-4 h-4 text-white fill-white" />
              </div>
           </div>

           <div className="hidden md:flex items-center gap-3 flex-1 max-w-md group">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..."
                className="bg-transparent border-none focus:ring-0 text-sm text-text-primary placeholder-slate-400 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>

           <div className="flex items-center gap-6">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 transition-colors rounded-lg ${showNotifications ? "bg-slate-50 text-primary" : "text-slate-400 hover:text-text-primary"}`}
                >
                   <Bell className="w-5 h-5" />
                   {notifications.filter(n => !n.isRead).length > 0 && (
                     <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent text-[9px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        {notifications.filter(n => !n.isRead).length}
                     </span>
                   )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-premium border border-slate-100 z-50 overflow-hidden"
                    >
                       <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                          <h4 className="text-xs font-bold text-text-primary uppercase tracking-widest">Notifications</h4>
                          <button 
                            onClick={handleMarkAllAsRead}
                            className="text-[10px] font-bold text-primary hover:underline"
                          >
                             Mark all read
                          </button>
                       </div>
                       <div className="max-h-96 overflow-y-auto custom-scrollbar">
                          {notifications.length > 0 ? (
                            notifications.map(n => (
                              <div 
                                key={n._id} 
                                onClick={() => handleMarkAsRead(n._id)}
                                className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.isRead ? "bg-primary/5" : ""}`}
                              >
                                 {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                                 <p className="text-sm font-bold text-text-primary mb-1">{n.title}</p>
                                 <p className="text-xs text-text-secondary leading-relaxed">{n.message}</p>
                                 <p className="text-[10px] text-text-muted mt-2 font-medium">
                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </p>
                              </div>
                            ))
                          ) : (
                            <div className="p-12 text-center">
                               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                  <Bell className="w-6 h-6" />
                               </div>
                               <p className="text-xs font-bold text-text-muted uppercase tracking-widest">All caught up</p>
                            </div>
                          )}
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="h-6 w-px bg-slate-100"></div>

              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-text-primary leading-none mb-1">{user?.username || 'Admin'}</p>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Super Admin</p>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {user?.username?.[0] || 'A'}
                 </div>
              </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === "talents" && (
              <>
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                  <div>
                      <h1 className="text-3xl font-bold text-text-primary tracking-tight">Talent Management</h1>
                      <p className="text-text-secondary text-sm">Review and manage professional profiles.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                      {/* Status Filter */}
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-4 focus:ring-primary/5 outline-none shadow-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>

                      <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <button 
                          onClick={() => setViewMode("table")}
                          className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-primary-light text-primary" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setViewMode("grid")}
                          className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary-light text-primary" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                      </div>
                  </div>
                </header>

                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
                    </motion.div>
                  ) : talents.length > 0 ? (
                    <motion.div
                      key={viewMode}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {viewMode === "table" ? (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-premium">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                  <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Professional</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">Expertise</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted text-center">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                  {talents.map(t => (
                                    <tr key={t._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-bold text-xs">
                                                {t.fullName[0].toUpperCase()}
                                              </div>
                                              <div>
                                                <p className="font-bold text-text-primary text-sm">{t.fullName}</p>
                                                <p className="text-xs text-text-muted">{t.email}</p>
                                              </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4">
                                          <p className="text-sm font-semibold text-text-primary">{t.primarySkill}</p>
                                          <p className="text-xs text-text-muted">{t.experience} yrs experience • {t.jobSite || "Remote"}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                          {t.status === 'pending' ? (
                                            <button 
                                              onClick={() => handleApprove(t._id)}
                                              className="px-4 py-1.5 bg-accent text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-accent-hover transition-all shadow-sm"
                                            >
                                              Approve
                                            </button>
                                          ) : (
                                            <button 
                                              onClick={() => handleToggleStatus(t._id, t.status)}
                                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${t.status === 'inactive' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}
                                            >
                                                {t.status || 'active'}
                                            </button>
                                          )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                          <div className="flex justify-end gap-2">
                                            <button 
                                              onClick={() => handleDelete(t._id)}
                                              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {talents.map(t => (
                                <Card key={t._id} className="clean-card clean-card-hover border-none shadow-premium">
                                  <CardContent className="p-6">
                                      <div className="flex justify-between items-start mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                            <User className="w-5 h-5" />
                                        </div>
                                        {t.status === 'pending' ? (
                                          <button 
                                            onClick={() => handleApprove(t._id)}
                                            className="px-3 py-1 bg-accent text-white rounded-lg text-[10px] font-bold uppercase hover:bg-accent-hover transition-all"
                                          >
                                            Approve
                                          </button>
                                        ) : (
                                          <button 
                                            onClick={() => handleToggleStatus(t._id, t.status)}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${t.status === 'inactive' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}
                                          >
                                            {t.status || 'active'}
                                          </button>
                                        )}
                                      </div>
                                      
                                      <h4 className="font-bold text-text-primary mb-1 truncate">{t.fullName}</h4>
                                      <p className="text-xs text-text-muted mb-6 truncate">{t.email}</p>
                                      
                                      <div className="bg-slate-50 p-4 rounded-xl mb-6">
                                        <p className="text-xs font-bold text-text-primary mb-1">{t.primarySkill}</p>
                                        <p className="text-[10px] text-text-muted font-medium">{t.experience} Years • {t.jobSite || "Remote"}</p>
                                      </div>
                                      
                                      <div className="flex justify-end">
                                        <button 
                                          onClick={() => handleDelete(t._id)}
                                          className="text-text-muted hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                  </CardContent>
                                </Card>
                            ))}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-24 text-center"
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                          <Search className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">No records found</h3>
                      <p className="text-text-secondary text-sm">We couldn't find any talents matching your current criteria.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {activeTab === "analytics" && (
              <AnalyticsView stats={stats} loading={loading} />
            )}

            {activeTab === "settings" && (
              <SettingsView user={user} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active = false, onClick, disabled = false }) {
  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
        ${active ? "bg-primary-light text-primary" : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
}

function AnalyticsView({ stats, loading }) {
  if (loading && !stats) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
  </div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
       <header className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Platform Analytics</h1>
          <p className="text-text-secondary text-sm">Real-time performance and network growth insights.</p>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Network" value={stats?.total || 0} icon={Users} color="bg-blue-500" />
          <StatCard title="Active Talents" value={stats?.active || 0} icon={CheckCircle2} color="bg-emerald-500" />
          <StatCard title="Pending Review" value={stats?.pending || 0} icon={Clock} color="bg-amber-500" />
          <StatCard title="Retention" value="98.2%" icon={Zap} color="bg-indigo-500" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="clean-card border-none shadow-premium">
             <CardContent className="p-8">
                <h3 className="font-bold text-text-primary mb-6">Skill Distribution</h3>
                <div className="space-y-6">
                   {stats?.skillStats?.map((s, i) => (
                      <div key={i}>
                         <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-text-primary">{s._id}</span>
                            <span className="text-text-muted">{s.count}</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${(s.count / stats.total) * 100}%` }}
                            ></div>
                         </div>
                      </div>
                   ))}
                </div>
             </CardContent>
          </Card>

          <Card className="clean-card border-none shadow-premium">
             <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-primary-light p-4 rounded-3xl mb-6">
                   <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">Network Velocity</h3>
                <p className="text-text-secondary text-sm max-w-xs mx-auto mb-8">
                   Your network has grown by <span className="text-emerald-600 font-bold">+12%</span> this month.
                </p>
                <div className="flex items-end gap-2 h-32">
                   {[40, 65, 45, 90, 55, 75, 85].map((h, i) => (
                      <div key={i} className="w-8 bg-primary/10 hover:bg-primary transition-colors rounded-t-lg" style={{ height: `${h}%` }}></div>
                   ))}
                </div>
             </CardContent>
          </Card>
       </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="clean-card border-none shadow-premium overflow-hidden group">
       <CardContent className="p-6">
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center text-${color.split('-')[1]}-600 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" style={{ color: color.replace('bg-', '') }} />
             </div>
             <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{title}</p>
                <h4 className="text-2xl font-bold text-text-primary">{value}</h4>
             </div>
          </div>
       </CardContent>
    </Card>
  );
}

function SettingsView({ user }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
       <header className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">System Settings</h1>
          <p className="text-text-secondary text-sm">Configure your administrative preferences and profile.</p>
       </header>

       <div className="max-w-2xl">
          <Card className="clean-card border-none shadow-premium mb-8">
             <CardContent className="p-8">
                <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2">
                   <User className="w-5 h-5 text-primary" /> Admin Profile
                </h3>
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Username</label>
                         <p className="font-bold text-text-primary p-3 bg-slate-50 rounded-xl">{user?.username}</p>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Role</label>
                         <p className="font-bold text-emerald-600 p-3 bg-emerald-50 rounded-xl">Super Admin</p>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Account Status</label>
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                         Verified & Secure
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="clean-card border-none shadow-premium">
             <CardContent className="p-8">
                <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-primary" /> Security & Preferences
                </h3>
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div>
                         <p className="font-bold text-text-primary text-sm">Two-Factor Authentication</p>
                         <p className="text-xs text-text-muted">Enhance your account security.</p>
                      </div>
                      <div className="w-10 h-5 bg-primary rounded-full relative">
                         <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div>
                         <p className="font-bold text-text-primary text-sm">Email Notifications</p>
                         <p className="text-xs text-text-muted">Receive alerts for new talent applications.</p>
                      </div>
                      <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                         <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>
       </div>
    </motion.div>
  );
}
