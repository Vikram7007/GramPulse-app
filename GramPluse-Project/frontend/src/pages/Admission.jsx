import React from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, BookOpen, FileText, CheckCircle, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';

const Admission = () => {
    const { t } = useTranslation();

    const steps = [
        {
            title: "Online Registration",
            desc: "Register yourself on our portal with basic details.",
            icon: GraduationCap,
            color: "emerald"
        },
        {
            title: "Document Verification",
            desc: "Upload necessary documents for verification.",
            icon: FileText,
            color: "blue"
        },
        {
            title: "Entrance Exam",
            desc: "Appear for the mandatory aptitude test.",
            icon: BookOpen,
            color: "purple"
        },
        {
            title: "Final Admission",
            desc: "Pay fees and confirm your seat.",
            icon: CheckCircle,
            color: "orange"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-[3rem] bg-[#6CA651] p-12 text-white mb-16 shadow-2xl shadow-emerald-200">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            Admissions Open 2026-27
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            Start Your Journey <br /> With GramPulse
                        </h1>
                        <p className="text-xl text-emerald-50 opacity-90 mb-8 max-w-xl font-medium leading-relaxed">
                            Join our prestigious institution and shape your future with world-class education and community-driven learning experiences.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-8 py-4 bg-white text-[#6CA651] rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-emerald-50 transition-all hover:scale-105 shadow-xl shadow-black/10">
                                Apply Now
                            </button>
                            <button className="px-8 py-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-white/20 transition-all">
                                Download Brochure
                            </button>
                        </div>
                    </div>
                </div>

                {/* Admission Process */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-emerald-950 mb-2">Admission Process</h2>
                        <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Simple 4-Step Journey</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="group relative bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                <div className={`w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-emerald-950 mb-3">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">{step.desc}</p>
                                <div className="text-xs font-black text-emerald-500 items-center gap-1 opacity-0 group-hover:opacity-100 transition-all flex">
                                    Learn More <ChevronRight className="w-3 h-3" />
                                </div>
                                <div className="absolute top-8 right-8 text-4xl font-black text-emerald-50 opacity-50 group-hover:opacity-100 transition-all">
                                    0{idx + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-emerald-50 shadow-sm">
                        <h2 className="text-3xl font-black text-emerald-950 mb-8">Inquiry Form</h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Full Name</label>
                                <input type="text" placeholder="Enter your name" className="w-full px-6 py-4 bg-emerald-50/50 border-none rounded-2xl outline-none ring-2 ring-emerald-50 focus:ring-[#6CA651] transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Email Address</label>
                                <input type="email" placeholder="you@example.com" className="w-full px-6 py-4 bg-emerald-50/50 border-none rounded-2xl outline-none ring-2 ring-emerald-50 focus:ring-[#6CA651] transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Course Interested</label>
                                <select className="w-full px-6 py-4 bg-emerald-50/50 border-none rounded-2xl outline-none ring-2 ring-emerald-50 focus:ring-[#6CA651] transition-all">
                                    <option>B.Tech Computer Science</option>
                                    <option>MBA Marketing</option>
                                    <option>Data Science Specialist</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Contact Number</label>
                                <input type="tel" placeholder="+91 00000 00000" className="w-full px-6 py-4 bg-emerald-50/50 border-none rounded-2xl outline-none ring-2 ring-emerald-50 focus:ring-[#6CA651] transition-all" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4">Message</label>
                                <textarea placeholder="Tell us about your interests..." rows="4" className="w-full px-6 py-4 bg-emerald-50/50 border-none rounded-2xl outline-none ring-2 ring-emerald-50 focus:ring-[#6CA651] transition-all resize-none"></textarea>
                            </div>
                            <div className="md:col-span-2 pt-4">
                                <button className="w-full py-5 bg-[#6CA651] text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20">
                                    Submit Inquiry
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#6CA651] rounded-[3rem] p-10 text-white shadow-xl">
                            <h3 className="text-2xl font-black mb-6">Need Help?</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Call Us</p>
                                        <p className="font-bold">+91 1234 567 890</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Email Us</p>
                                        <p className="font-bold">admission@grampulse.edu</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Visit Us</p>
                                        <p className="font-bold">Ralegan Siddhi, Maharashtra</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-[3rem] p-8 border border-emerald-50 shadow-sm text-center">
                            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
                                <GraduationCap className="w-10 h-10" />
                            </div>
                            <h4 className="font-black text-emerald-950 mb-2">Scholarships Available</h4>
                            <p className="text-gray-500 text-xs mb-6">Merit-based scholarships up to 100% for deserving candidates.</p>
                            <button className="text-xs font-black text-[#6CA651] uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">View Eligibility</button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes progress {
                    from { width: 0; }
                }
                .animate-progress {
                    animation: progress 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default Admission;











