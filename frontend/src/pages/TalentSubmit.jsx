import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createTalent } from "../services/api";
import { Input, Textarea } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import toast from "react-hot-toast";
import { User, Mail, Briefcase, Clock, CheckCircle2, Sparkles, MapPin, ArrowRight, FileText } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const talentSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  primarySkill: z.string().min(2, "Please specify your primary skill"),
  experience: z.coerce.number().min(0, "Experience cannot be negative").max(50, "Max experience is 50 years"),
  jobSite: z.enum(["Remote", "On-site", "Hybrid"]),
  description: z.string().min(20, "Bio must be at least 20 characters").max(1000, "Bio is too long"),
});

export default function TalentSubmit() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm({
    resolver: zodResolver(talentSchema),
    defaultValues: {
      jobSite: "Remote"
    }
  });

  const selectedJobSite = watch("jobSite");

  const onSubmit = async (data) => {
    try {
      await createTalent(data);
      setIsSuccess(true);
      reset();
      toast.success("Profile submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-light-bg-secondary min-h-[80vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-premium border border-slate-100"
        >
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-3">Profile Submitted</h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
                Thank you for joining our elite network. Our team will review your profile and get back to you soon.
            </p>
            <div className="flex flex-col gap-3">
                <Link to="/" className="w-full">
                    <Button className="w-full py-4 rounded-xl font-bold">Back to Home</Button>
                </Link>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors py-2"
                >
                  Submit another application
                </button>
            </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-light-bg-secondary min-h-screen py-16 lg:py-24">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-accent text-xs font-bold uppercase tracking-widest mb-6">
                  <Sparkles className="w-3 h-3" />
                  Join the Network
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                  Showcase your expertise.
              </h1>
              <p className="text-text-secondary text-lg max-w-xl mx-auto">
                  Join Talentry's global directory of top-tier specialists and get noticed by world-class companies.
              </p>
          </div>

          <div className="clean-card overflow-hidden">
              <div className="p-8 lg:p-12">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                              label="Full Name"
                              placeholder="E.g. Jane Smith"
                              icon={User}
                              error={errors.fullName?.message}
                              {...register("fullName")}
                          />
                          <Input
                              label="Email Address"
                              type="email"
                              placeholder="jane@talentry.ai"
                              icon={Mail}
                              error={errors.email?.message}
                              {...register("email")}
                          />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                              label="Primary Skill"
                              placeholder="E.g. Senior Backend Engineer"
                              icon={Briefcase}
                              error={errors.primarySkill?.message}
                              {...register("primarySkill")}
                          />
                          <Input
                              label="Experience (Years)"
                              type="number"
                              placeholder="5"
                              icon={Clock}
                              error={errors.experience?.message}
                              {...register("experience")}
                          />
                      </div>

                      <div className="space-y-3">
                          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              Preferred Job Site
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                              {["Remote", "Hybrid", "On-site"].map((site) => (
                                  <button
                                      key={site}
                                      type="button"
                                      onClick={() => setValue("jobSite", site)}
                                      className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                                          selectedJobSite === site 
                                          ? "bg-primary text-white border-primary shadow-sm" 
                                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                      }`}
                                  >
                                      {site}
                                  </button>
                              ))}
                          </div>
                          {errors.jobSite && <p className="text-xs font-medium text-red-500">{errors.jobSite.message}</p>}
                      </div>

                      <Textarea
                          label="Short Professional Bio"
                          placeholder="Describe your background, key projects, and expertise..."
                          icon={FileText}
                          error={errors.description?.message}
                          {...register("description")}
                      />

                      <Button 
                        type="submit" 
                        isLoading={isSubmitting} 
                        className="w-full py-4 rounded-xl font-bold gap-3"
                      >
                          Submit Application
                          <ArrowRight className="w-4 h-4" />
                      </Button>
                      
                      <p className="text-center text-[11px] text-text-muted font-medium uppercase tracking-wider">
                        By submitting, you agree to our terms of service and privacy policy.
                      </p>
                  </form>
              </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
