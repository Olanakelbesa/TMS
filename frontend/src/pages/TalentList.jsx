import { useEffect, useState } from "react";
import { getTalents, deleteTalent, updateTalent } from "../services/api";
import toast from "react-hot-toast";
import { Search, Trash2, Filter, MoreHorizontal, User, Briefcase, Calendar, Zap, LayoutGrid, List, MapPin } from "lucide-react";

export default function TalentList() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true);
        const res = await getTalents({ search, skill });
        setTalents(res.data.data);
      } catch (err) {
        console.error("Fetch talents error:", err);
        toast.error("Failed to load talents");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchTalents, 300);
    return () => clearTimeout(timeoutId);
  }, [search, skill]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteTalent(id);
      setTalents(talents.filter((t) => t._id !== id));
      toast.success("Talent deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateTalent(id, { status: newStatus });
      setTalents(talents.map(t => t._id === id ? { ...t, status: newStatus } : t));
      toast.success(`Talent marked as ${newStatus}`);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed");
    }
  };

  const skills = ["All", "Frontend Developer", "Backend Developer", "UI/UX Designer", "Product Manager", "Data Scientist"];

  return (
    <div className="bg-light-bg-secondary min-h-screen py-12">
      <div className="container-custom">
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
              <Zap className="w-3 h-3 fill-primary" />
              Talentry Talent
            </div>
            <h2 className="text-4xl font-black text-dark-bg tracking-tighter uppercase whitespace-nowrap">
              Managed <span className="text-primary italic">Talent</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <input
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                placeholder="Search name, skill, or bio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative lg:w-56">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <select
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-8 text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer font-semibold text-dark-bg"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              >
                {skills.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                 <MoreHorizontal className="w-4 h-4 text-slate-400 rotate-90" />
              </div>
            </div>

            <div className="hidden sm:flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
               <button 
                 onClick={() => setViewMode("grid")}
                 className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-primary/10 text-primary shadow-inner" : "text-slate-400 hover:text-slate-600"}`}
               >
                  <LayoutGrid className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => setViewMode("list")}
                 className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-primary/10 text-primary shadow-inner" : "text-slate-400 hover:text-slate-600"}`}
               >
                  <List className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex gap-4 mb-8">
           <div className="bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-dark-bg uppercase tracking-tight">{talents.length} Total Records</span>
           </div>
           <div className="bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-dark-bg uppercase tracking-tight">{talents.filter(t => t.status !== 'inactive').length} Active</span>
           </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-white/50 animate-pulse rounded-[32px] border border-slate-200 shadow-sm"></div>
            ))}
          </div>
        ) : talents.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
            {talents.map((t) => (
              <div 
                key={t._id} 
                className={`bg-white rounded-[32px] border border-slate-200 p-8 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${viewMode === "list" ? "flex items-center justify-between" : ""}`}
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0 group-hover:scale-125 transition-transform" />
                
                <div className={viewMode === "list" ? "flex items-center gap-8 flex-1" : "relative z-10"}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary transition-colors duration-500">
                      <User className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggleStatus(t._id, t.status || 'active')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${t.status === 'inactive' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}
                        title="Toggle Status"
                      >
                        {t.status || 'active'}
                      </button>
                    </div>
                  </div>

                  <div className={viewMode === "list" ? "flex flex-col" : ""}>
                    <h3 className="text-2xl font-black text-dark-bg group-hover:text-primary transition-colors uppercase tracking-tighter leading-tight mb-2">
                      {t.fullName}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-text-secondary text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Briefcase className="w-3 h-3 text-primary" />
                        {t.primarySkill}
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <MapPin className="w-3 h-3 text-primary" />
                        {t.jobSite || "Remote"}
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Calendar className="w-3 h-3 text-primary" />
                        {t.experience} Years EXP
                      </div>
                    </div>
                  </div>
                </div>

                <div className={viewMode === "list" ? "max-w-md mx-8 flex-1 hidden md:block" : "relative z-10"}>
                  <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed mb-8">
                    {t.description}
                  </p>
                </div>

                <div className={`flex items-center gap-3 relative z-10 ${viewMode === "list" ? "" : "border-t border-slate-100 pt-6 mt-auto justify-between"}`}>
                  <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-1.5 group/btn border-b-2 border-transparent hover:border-primary transition-all pb-1">
                    Details <MoreHorizontal className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-dark-bg uppercase tracking-tight">No talents found</h3>
            <p className="text-text-secondary mt-2 max-w-sm mx-auto leading-relaxed">We couldn't find any results matching your current criteria. Try refining your filters.</p>
            <button
              onClick={() => { setSearch(""); setSkill("All"); }}
              className="mt-8 text-primary font-black text-xs uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary-hover hover:border-primary-hover transition-all"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
