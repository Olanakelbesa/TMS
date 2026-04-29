import { useEffect, useState, useRef } from "react";
import { getTalents } from "../services/api";
import { TalentCardSkeleton } from "../components/ui/Skeleton";
import { Search, Filter, Clock, MapPin, User, ChevronRight} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";

export default function TalentTalent() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true);
        const res = await getTalents({ search, skill });
        setTalents(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load talents");
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchTalents, 300);
    return () => clearTimeout(timeoutId);
  }, [search, skill]);

  const skills = ["All", "Frontend Developer", "Backend Developer", "UI/UX Designer", "Product Manager", "Data Scientist", "DevOps Engineer"];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Area */}
      <section className="pt-16 pb-12 bg-light-bg-secondary border-b border-slate-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                Elite Talent Talent
              </h1>
              <p className="text-text-secondary text-lg">
                Discover world-class professionals ready to transform your vision into reality.
              </p>
            </motion.div>
          </div>

          {/* Clean Filter Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-premium border border-slate-100 p-2 flex flex-col md:flex-row gap-2 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, skill..."
                className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-text-primary placeholder-slate-400 font-medium outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
            
            <div className="relative w-full md:w-64" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-text-secondary truncate">
                    {skill === "All" ? "All Skills" : skill}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-premium border border-slate-100 p-1.5 z-50"
                  >
                    {skills.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSkill(s);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm text-left font-medium transition-colors ${
                          skill === s ? "bg-primary-light text-primary" : "text-text-secondary hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button className="w-full md:w-auto h-12 px-8 rounded-xl font-bold">
              Find Talent
            </Button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container-custom py-16">
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => <TalentCardSkeleton key={i} />)}
            </div>
        ) : talents.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {talents.map((talent, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={talent._id} 
                  className="clean-card clean-card-hover p-8 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary border border-slate-100">
                      <User className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-primary-light text-primary text-[11px] font-bold uppercase tracking-wider rounded-full">
                      {talent.primarySkill}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-text-primary mb-2 truncate">
                    {talent.fullName}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-semibold text-text-muted mb-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {talent.experience} yrs
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {talent.jobSite || "Remote"}
                    </div>
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-8 flex-1">
                    {talent.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
        ) : (
            <div className="text-center py-24 bg-light-bg-secondary rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-slate-300">
                    <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">No profiles found</h3>
                <p className="text-text-secondary text-sm mb-8">Try adjusting your search or filters.</p>
                <Button 
                  variant="secondary"
                  onClick={() => { setSearch(""); setSkill("All"); }}
                >
                  Clear all filters
                </Button>
            </div>
        )}
      </section>
    </div>
  );
}
