import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  LayoutDashboard, 
  SlidersHorizontal, 
  FileText, 
  Search, 
  Bell, 
  Menu, 
  Upload, 
  FileDown,
  MessageSquare,
  X,
  Send,
  User,
  Bot,
  Download,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Users,
  Home,
  BookOpen,
  DollarSign,
  Plus,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Papa from "papaparse";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis,
  Cell,
  Legend,
  PieChart,
  Pie,
  LineChart,
  Line
} from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TeacherData, AdminData, CPSData, TabType } from "./types";
import { getGeminiResponse } from "./services/geminiService";
import { jsPDF } from "jspdf";
import { toPng, toJpeg } from "html-to-image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants ---
const VALOR_PUNTO_2026 = 23923;
const VALOR_PUNTO_2027 = 25598;
const PUNTOS_FORMALIZACION = 72;
const BONIFICACION_RATE = 0.35;
const COSTO_ADECUACION_OFICINA = 2500000;
const AUMENTO_SALARIAL_2027 = 1.07;
const AUMENTO_CATEDRATICOS_2027 = 1.08;

const FACTOR_PRESTACIONAL = (
  1 +
  (15 / 360) + // Vacaciones
  (15 / 360) + // Prima vacaciones
  (15 / 360) + // Prima servicios
  (30 / 360) + // Prima Navidad
  (30 / 360) + // Cesantias
  0.16 +       // Pension
  0.03         // Otras
) * 12;

const COSTO_CATEDRATICO_1 = 4783236;
const COSTO_CATEDRATICO_2 = 7983236;

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold",
      active ? "bg-uptc-yellow text-uptc-black shadow-md" : "text-white/80 hover:bg-white/10"
    )}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const KPICard = ({ 
  title, 
  value, 
  icon: Icon, 
  label, 
  color = "uptc-yellow" 
}: { 
  title: string, 
  value: string | number, 
  icon: any, 
  label?: string, 
  color?: string 
}) => (
  <div className={cn("bg-white p-6 rounded-2xl border-b-4 shadow-md", `border-${color}`)}>
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
        <Icon className="text-uptc-black" size={24} />
      </div>
      {label && (
        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full uppercase">
          {label}
        </span>
      )}
    </div>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    <p className="text-3xl font-extrabold text-uptc-black mt-1">{value}</p>
  </div>
);

// --- Landing Page ---

const LandingPage = ({ 
  onStartDocente, 
  onStartAdmin, 
  onStartCPS,
  onStartModeloTecnico,
  onStartCostoFormalizacion
}: { 
  onStartDocente: () => void, 
  onStartAdmin: () => void, 
  onStartCPS: () => void,
  onStartModeloTecnico: () => void,
  onStartCostoFormalizacion: () => void
}) => {
  return (
    <div className="min-h-screen bg-uptc-black font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-uptc-yellow rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-uptc-yellow rounded-full blur-[100px]"
        />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <img crossOrigin="anonymous"
              src="https://raw.githubusercontent.com/fabiancho0724/CSV-Simulador/7c20b9207ee45e0e54715cea26798ffff981146a/uptc-blanco%20(1).png" 
              alt="UPTC Logo" 
              className="h-24 md:h-32 drop-shadow-2xl"
            />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight"
          >
            DECISIONES BASADAS EN <span className="text-uptc-yellow">ANALÍTICA DE DATOS</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-medium"
          >
            Potenciando la excelencia académica a través de la transformación digital y el análisis estratégico de la información docente y administrativa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-6 justify-center"
          >
            <button 
              onClick={onStartDocente}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-uptc-yellow text-uptc-black rounded-2xl font-black text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,204,41,0.3)] transition-all"
            >
              Docentes
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={onStartAdmin}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-uptc-black rounded-2xl font-black text-lg border-2 border-uptc-yellow hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all"
            >
              Administrativos
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={onStartCPS}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-uptc-black text-white rounded-2xl font-black text-lg border-2 border-uptc-yellow hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all"
            >
              CPS
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={onStartModeloTecnico}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-uptc-yellow/10 text-uptc-yellow rounded-2xl font-black text-lg border-2 border-uptc-yellow/30 hover:bg-uptc-yellow hover:text-uptc-black transition-all"
            >
              Modelo Técnico
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={onStartCostoFormalizacion}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-uptc-black rounded-2xl font-black text-lg border-2 border-uptc-yellow hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all"
            >
              Costo Formalización
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-uptc-yellow rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Modelo Técnico Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-uptc-yellow/20 rounded-full blur-3xl" />
              <img crossOrigin="anonymous"
                src="https://raw.githubusercontent.com/fabiancho0724/CSV-Simulador/22597acab94e5a7d70844571989db34fcd0af0f7/uptc.jpg" 
                alt="Modelo Técnico" 
                className="rounded-[2rem] shadow-2xl relative z-10 w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black text-uptc-black mb-6 leading-tight uppercase">
                MODELO <span className="text-uptc-yellow">TÉCNICO MATEMÁTICO</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Acceda a la documentación detallada y los fundamentos matemáticos que sustentan nuestras proyecciones de impacto fiscal y equidad salarial.
              </p>
              <button 
                onClick={onStartModeloTecnico}
                className="group flex items-center gap-3 px-8 py-4 bg-uptc-black text-white rounded-2xl font-black text-lg hover:scale-105 transition-all"
              >
                Ver Reporte Técnico
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Docentes Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h2 className="text-4xl font-black text-uptc-black mb-6 leading-tight uppercase">
                GESTIÓN DE <span className="text-uptc-yellow">DOCENTES</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Analice la estructura salarial docente, identifique brechas de equidad y proyecte el impacto de la formalización basada en méritos académicos.
              </p>
              <button 
                onClick={onStartDocente}
                className="group flex items-center gap-3 px-8 py-4 bg-uptc-black text-white rounded-2xl font-black text-lg hover:scale-105 transition-all"
              >
                Explorar Docentes
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 relative"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-uptc-yellow/20 rounded-full blur-3xl" />
              <img crossOrigin="anonymous"
                src="https://raw.githubusercontent.com/fabiancho0724/CSV-Simulador/22597acab94e5a7d70844571989db34fcd0af0f7/uptc-edificio-estudiantes.jpg" 
                alt="Gestión Docentes UPTC" 
                className="rounded-[2rem] shadow-2xl relative z-10 w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Administrativos Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-uptc-yellow/20 rounded-full blur-3xl" />
              <img crossOrigin="anonymous"
                src="https://raw.githubusercontent.com/fabiancho0724/CSV-Simulador/22597acab94e5a7d70844571989db34fcd0af0f7/tunjaC2.JPG_2142355918.jpg" 
                alt="Gestión Administrativos UPTC" 
                className="rounded-[2rem] shadow-2xl relative z-10 w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black text-uptc-black mb-6 leading-tight uppercase">
                GESTIÓN DE <span className="text-uptc-yellow">ADMINISTRATIVOS</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Gestione la planta de personal administrativo con herramientas de proyección de costos y análisis de beneficios prestacionales para una administración eficiente.
              </p>
              <button 
                onClick={onStartAdmin}
                className="group flex items-center gap-3 px-8 py-4 bg-uptc-black text-white rounded-2xl font-black text-lg hover:scale-105 transition-all"
              >
                Explorar Administrativos
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CPS Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-uptc-yellow/20 rounded-full blur-3xl" />
              <img crossOrigin="anonymous"
                src="https://raw.githubusercontent.com/fabiancho0724/CSV-Simulador/22597acab94e5a7d70844571989db34fcd0af0f7/Sede_Centralx_UPTC__Ente_universitario_autoxnomox_de_caraxcter_nacionalx_estatal_y_puxblico._Fundada_en_1953_durante_la_presidencia_de_Gustavo_Rojas_Pinilla._Una_historia_de_presencia_institu.jpg" 
                alt="Gestión CPS UPTC" 
                className="rounded-[2rem] shadow-2xl relative z-10 w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black text-uptc-black mb-6 leading-tight uppercase">
                GESTIÓN DE <span className="text-uptc-yellow">CPS</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Optimice la formalización de contratistas por prestación de servicios. Nuestro simulador permite proyectar el impacto presupuestal de pasar contratos CPS a la planta de personal.
              </p>
              <button 
                onClick={onStartCPS}
                className="group flex items-center gap-3 px-8 py-4 bg-uptc-black text-white rounded-2xl font-black text-lg hover:scale-105 transition-all"
              >
                Explorar CPS
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-uptc-black mb-4">CAPACIDADES DEL SISTEMA</h2>
            <div className="w-20 h-2 bg-uptc-yellow mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={TrendingUp}
              title="Análisis de Impacto"
              description="Visualice el impacto fiscal de la formalización docente, administrativa y CPS con datos en tiempo real y proyecciones precisas."
            />
            <FeatureCard 
              icon={Users}
              title="Equidad Salarial"
              description="Identifique brechas y asegure una distribución justa basada en méritos académicos y experiencia."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Reportes Oficiales"
              description="Genere informes detallados en PDF y CSV listos para procesos administrativos y de auditoría."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-uptc-black text-white border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-white/60 font-medium">
            ©Fabián L. Cely – VAFI – Universidad Pedagógica y Tecnológica de Colombia
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 hover:border-uptc-yellow/30 transition-all"
  >
    <div className="w-16 h-16 bg-uptc-yellow/10 rounded-2xl flex items-center justify-center mb-8">
      <Icon className="text-uptc-black" size={32} />
    </div>
    <h3 className="text-2xl font-black text-uptc-black mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed font-medium">{description}</p>
  </motion.div>
);

// --- Costo Formalización Page ---

const CostoFormalizacionPage = ({ 
  summary, 
  countDoc1, setCountDoc1,
  countCPSProf1, setCountCPSProf1,
  countCPSTec1, setCountCPSTec1,
  countCPSAsis1, setCountCPSAsis1,
  countDoc2, setCountDoc2,
  countCPSProf2, setCountCPSProf2,
  countCPSTec2, setCountCPSTec2,
  countCPSAsis2, setCountCPSAsis2
}: { 
  summary: any,
  countDoc1: number, setCountDoc1: (v: number) => void,
  countCPSProf1: number, setCountCPSProf1: (v: number) => void,
  countCPSTec1: number, setCountCPSTec1: (v: number) => void,
  countCPSAsis1: number, setCountCPSAsis1: (v: number) => void,
  countDoc2: number, setCountDoc2: (v: number) => void,
  countCPSProf2: number, setCountCPSProf2: (v: number) => void,
  countCPSTec2: number, setCountCPSTec2: (v: number) => void,
  countCPSAsis2: number, setCountCPSAsis2: (v: number) => void
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-uptc-black mb-6 uppercase tracking-tight">Parámetros de <span className="text-uptc-yellow">Proyección</span></h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Year 1 Inputs */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-uptc-black border-b border-gray-100 pb-2">Año 1: Cantidades a Formalizar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Docentes</label>
                <input 
                  type="number" 
                  value={countDoc1} 
                  onChange={(e) => setCountDoc1(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-uptc-yellow outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPS Profesional</label>
                <input 
                  type="number" 
                  value={countCPSProf1} 
                  onChange={(e) => setCountCPSProf1(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-uptc-yellow outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPS Técnico</label>
                <input 
                  type="number" 
                  value={countCPSTec1} 
                  onChange={(e) => setCountCPSTec1(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-uptc-yellow outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPS Asistencial</label>
                <input 
                  type="number" 
                  value={countCPSAsis1} 
                  onChange={(e) => setCountCPSAsis1(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-uptc-yellow outline-none"
                />
              </div>
            </div>
          </div>

          {/* Year 2 Inputs */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-uptc-black border-b border-gray-100 pb-2">Año 2: Cantidades a Formalizar (Independientes)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Docentes</label>
                <input 
                  type="number" 
                  value={countDoc2} 
                  onChange={(e) => setCountDoc2(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-uptc-yellow outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPS Profesional</label>
                <input 
                  type="number" 
                  value={countCPSProf2} 
                  onChange={(e) => setCountCPSProf2(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-uptc-yellow outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPS Técnico</label>
                <input 
                  type="number" 
                  value={countCPSTec2} 
                  onChange={(e) => setCountCPSTec2(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-uptc-yellow outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPS Asistencial</label>
                <input 
                  type="number" 
                  value={countCPSAsis2} 
                  onChange={(e) => setCountCPSAsis2(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-uptc-yellow outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Year 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-uptc-black">Año 1</h3>
            <span className="px-4 py-1.5 bg-uptc-yellow/10 text-uptc-black rounded-full text-sm font-bold border border-uptc-yellow/20">Fase Inicial</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-uptc-black text-white rounded-2xl shadow-lg">
              <p className="text-xs font-bold text-uptc-yellow uppercase tracking-widest mb-2">Inversión Docentes</p>
              <p className="text-3xl font-black">${(summary.year1.docente.inv / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-white/40 mt-3">{summary.year1.docente.n} Docentes formalizados</p>
            </div>
            <div className="p-6 bg-uptc-black text-white rounded-2xl shadow-lg">
              <p className="text-xs font-bold text-uptc-yellow uppercase tracking-widest mb-2">Inversión Administrativos (CPS)</p>
              <p className="text-3xl font-black">${(summary.year1.cps.inv / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-white/40 mt-3">{summary.year1.cps.prof + summary.year1.cps.tec + summary.year1.cps.asis} Contratistas formalizados</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-uptc-black text-white">
                <tr>
                  <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Categoría</th>
                  <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest text-right">Inversión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-bold">Docentes</td>
                  <td className="px-4 py-3 text-right font-bold text-uptc-black">${(summary.year1.docente.inv / 1000000).toFixed(2)}M</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold">Administrativos (CPS)</td>
                  <td className="px-4 py-3 text-right font-bold text-uptc-black">${(summary.year1.cps.inv / 1000000).toFixed(2)}M</td>
                </tr>
                <tr className="bg-uptc-yellow/10">
                  <td className="px-4 py-3 font-black text-uptc-black uppercase">Total Año 1</td>
                  <td className="px-4 py-3 text-right font-black text-uptc-black">${(summary.year1.total / 1000000).toFixed(2)}M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Year 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-uptc-black">Año 2 (Incremental)</h3>
            <span className="px-4 py-1.5 bg-uptc-yellow/10 text-uptc-black rounded-full text-sm font-bold border border-uptc-yellow/20">Fase Consolidación</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-uptc-black text-white rounded-2xl shadow-lg">
              <p className="text-xs font-bold text-uptc-yellow uppercase tracking-widest mb-2">Inversión Docentes (Nuevos)</p>
              <p className="text-3xl font-black">${(summary.year2.docente.inv / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-white/40 mt-1">{summary.year2.docente.n} Docentes adicionales</p>
            </div>
            <div className="p-6 bg-uptc-black text-white rounded-2xl shadow-lg">
              <p className="text-xs font-bold text-uptc-yellow uppercase tracking-widest mb-2">Inversión Administrativos (Nuevos)</p>
              <p className="text-3xl font-black">${(summary.year2.cps.inv / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-white/40 mt-1">{summary.year2.cps.prof + summary.year2.cps.tec + summary.year2.cps.asis} Contratistas adicionales</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-uptc-black text-white">
                <tr>
                  <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Categoría</th>
                  <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest text-right">Inversión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-bold">Docentes</td>
                  <td className="px-4 py-3 text-right font-bold">${(summary.year2.docente.inv / 1000000).toFixed(2)}M</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold">Administrativos (CPS)</td>
                  <td className="px-4 py-3 text-right font-bold">${(summary.year2.cps.inv / 1000000).toFixed(2)}M</td>
                </tr>
                <tr className="bg-uptc-yellow/10">
                  <td className="px-4 py-3 font-black text-uptc-black uppercase">Total Año 2</td>
                  <td className="px-4 py-3 text-right font-black text-uptc-black">${(summary.year2.total / 1000000).toFixed(2)}M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-uptc-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-uptc-yellow/10 rounded-full blur-[100px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">COSTO TOTAL <span className="text-uptc-yellow">FORMALIZACIÓN</span></h3>
            <p className="text-white/60 font-medium">Sumatoria proyectada de inversión para las fases 1 y 2.</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs font-bold text-uptc-yellow uppercase tracking-[0.3em] mb-2">Inversión Total Proyectada</p>
            <p className="text-6xl font-black text-white tracking-tighter">
              ${(summary.grandTotal / 1000000).toFixed(1)}<span className="text-2xl text-uptc-yellow ml-1">M</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("landing");
  const [data, setData] = useState<TeacherData[]>([]);
  const [adminData, setAdminData] = useState<AdminData[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hola Soy Centavito el amigo del Inge Lara ¿Cómo te puedo ayudar hoy?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const docenteSimRef = useRef<HTMLDivElement>(null);
  const adminSimRef = useRef<HTMLDivElement>(null);
  const cpsSimRef = useRef<HTMLDivElement>(null);
  const modeloTecnicoRef = useRef<HTMLDivElement>(null);
  const costoFormalizacionRef = useRef<HTMLDivElement>(null);

  const exportToPDF = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!ref.current) return;
    
    const originalStyle = ref.current.style.cssText;
    // Forzar que el contenedor se expanda completamente para capturar todo el contenido
    ref.current.style.height = "auto";
    ref.current.style.maxHeight = "none";
    ref.current.style.overflow = "visible";
    ref.current.style.flex = "none";
    ref.current.style.position = "relative";
    
    // Allow DOM to update layout before capturing
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const dataUrl = await toPng(ref.current, { 
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Handle multi-page PDF if content is too long
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Hubo un error al generar el PDF. Asegúrese de que las imágenes externas permitan CORS.");
    } finally {
      ref.current.style.cssText = originalStyle;
    }
  };

  const exportToJPG = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!ref.current) return;
    
    const originalStyle = ref.current.style.cssText;
    ref.current.style.height = "auto";
    ref.current.style.maxHeight = "none";
    ref.current.style.overflow = "visible";
    ref.current.style.flex = "none";
    ref.current.style.position = "relative";
    
    // Allow DOM to update layout before capturing
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const dataUrl = await toJpeg(ref.current, { 
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        quality: 0.9
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${filename}.jpg`;
      link.click();
    } catch (error) {
      console.error("Error exporting to JPG:", error);
      alert("Hubo un error al generar el JPG. Asegúrese de que las imágenes externas permitan CORS.");
    } finally {
      ref.current.style.cssText = originalStyle;
    }
  };

  // Simulator State
  const [simPop, setSimPop] = useState(100);
  const [numDocentesInput, setNumDocentesInput] = useState<string>("");

  useEffect(() => {
    if (data.length > 0) {
      const n = Math.ceil(data.length * (simPop / 100));
      setNumDocentesInput(n.toString());
    }
  }, [simPop, data.length]);
  const [simScenario, setSimScenario] = useState(1);
  const [budgetLimit, setBudgetLimit] = useState<number | "">("");

  // Admin Simulator State
  const [adminSimCount, setAdminSimCount] = useState<number>(1);
  const [adminSimSalary, setAdminSimSalary] = useState<number>(3700000);

  // CPS State
  const [cpsData, setCpsData] = useState<CPSData[]>([]);
  const [cpsFilterRecurso, setCpsFilterRecurso] = useState<string>("TODOS");
  const [cpsFilterNivel, setCpsFilterNivel] = useState<string>("TODOS");
  const [cpsFilterTipo, setCpsFilterTipo] = useState<string>("TODOS");
  const [cpsSimCount, setCpsSimCount] = useState<number | "">("");
  const [cpsSimBudget, setCpsSimBudget] = useState<number | "">("");
  const [cpsSimProfCount, setCpsSimProfCount] = useState<number>(0);
  const [cpsSimTecCount, setCpsSimTecCount] = useState<number>(0);
  const [cpsSimAsisCount, setCpsSimAsisCount] = useState<number>(0);

  useEffect(() => {
    const loadInitialData = async () => {
      // Load Docentes
      Papa.parse("https://raw.githubusercontent.com/fabiancho0724/CSV-Simulador/7cd58f66f3a3692b344cbc74a2d605a99c7556de/DOCENTES.csv", {
        download: true,
        header: false,
        delimiter: ";",
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as string[][];
          if (data.length === 0) return;
          let startIndex = isNaN(parseFloat(data[0][3])) ? 1 : 0;
          const parsedData: TeacherData[] = [];
          for (let i = startIndex; i < data.length; i++) {
            const fila = data[i];
            if (fila.length < 7) continue;
            const ptsEstudios = parseFloat(fila[3]) || 0;
            const ptsExp = parseFloat(fila[4]) || 0;
            const ptsProd = parseFloat(fila[5]) || 0;
            const puntos_actuales = ptsEstudios + ptsExp + ptsProd;
            const puntos_formalizados = puntos_actuales + PUNTOS_FORMALIZACION;
            const salario_actual = puntos_actuales * VALOR_PUNTO_2026;
            const salario_formalizado = puntos_formalizados * VALOR_PUNTO_2026;
            const costo_actual = salario_actual * FACTOR_PRESTACIONAL;
            const costo_formalizado = salario_formalizado * FACTOR_PRESTACIONAL;
            const bonificacion = salario_formalizado * BONIFICACION_RATE;
            const costo_formalizado_total = costo_formalizado + bonificacion;
            parsedData.push({
              id: `${fila[0] || "D"}-${i}`,
              tipo_vinculacion: fila[1] || "N/A",
              tipo_ingreso: fila[2] || "N/A",
              nombre: `Docente ${i + 1}`,
              puntos_estudios: ptsEstudios,
              puntos_experiencia: ptsExp,
              puntos_productividad: ptsProd,
              puntos_actuales,
              puntos_formalizados,
              salario_actual,
              salario_formalizado,
              costo_actual,
              costo_formalizado,
              bonificacion,
              costo_formalizado_total,
              categoria: fila[1] || "Instructor",
            });
          }
          setData(parsedData);
        }
      });

      // Load Administrativos
      Papa.parse("https://raw.githubusercontent.com/fabiancho0724/CSV-Simulador/7cd58f66f3a3692b344cbc74a2d605a99c7556de/ADMINISTRATIVOS.csv", {
        download: true,
        header: false,
        delimiter: ";",
        skipEmptyLines: true,
        complete: (results) => {
          const rawData = results.data as any[];
          if (rawData.length === 0) return;
          const dataRows = rawData[0][0]?.toString().toUpperCase().includes("NOMBRE") ? rawData.slice(1) : rawData;
          const parsedData: AdminData[] = dataRows.map((fila) => {
            const sueldoStr = fila[4] || "0";
            const sueldo = parseFloat(sueldoStr.toString().replace(/\./g, "").replace(/,/g, ".")) || 0;
            const prima_servicios = sueldo * 0.5;
            const prima_navidad = sueldo;
            const prima_vacaciones = sueldo * 0.5;
            const vacaciones = sueldo * 0.5;
            const cesantias = sueldo;
            const intereses_cesantias = cesantias * 0.12;
            const bonificacion_servicios = sueldo * 0.35;
            const seguridad_social = sueldo * 12 * 0.21;
            const parafiscales = sueldo * 12 * 0.09;
            const costo_anual_total = (sueldo * 12) + prima_servicios + prima_navidad + prima_vacaciones + vacaciones + cesantias + intereses_cesantias + bonificacion_servicios + seguridad_social + parafiscales;
            return {
              nombre: fila[0] || "N/A",
              numdoc: fila[1] || "N/A",
              cargo: fila[2] || "N/A",
              cargobase: fila[3] || "N/A",
              sueldo,
              clasificacion: fila[5] || "N/A",
              prima_servicios,
              prima_navidad,
              prima_vacaciones,
              vacaciones,
              cesantias,
              intereses_cesantias,
              bonificacion_servicios,
              seguridad_social,
              parafiscales,
              costo_anual_total
            };
          });
          setAdminData(parsedData);
        }
      });

      // Load CPS
      Papa.parse("https://raw.githubusercontent.com/fabiancho0724/CSV-Simulador/7cd58f66f3a3692b344cbc74a2d605a99c7556de/CPS.csv", {
        download: true,
        header: false,
        delimiter: ";",
        skipEmptyLines: true,
        complete: (results) => {
          const rawData = results.data as any[];
          if (rawData.length === 0) return;
          const dataRows = rawData[0][0]?.toString().toUpperCase().includes("NOMBRE") ? rawData.slice(1) : rawData;
          const parsedData: CPSData[] = dataRows.map((fila) => {
            const valorTotalContrato = parseFloat(fila[6]?.toString().replace(/\./g, "").replace(/,/g, ".")) || 0;
            const nivel = (fila[2] || "N/A").toString().toUpperCase();
            let sueldo = parseFloat(fila[7]?.toString().replace(/\./g, "").replace(/,/g, ".")) || 0;
            if (nivel === "ASISTENCIAL") sueldo = 2264237;
            
            const prima_servicios = sueldo * 0.5;
            const prima_navidad = sueldo;
            const prima_vacaciones = sueldo * 0.5;
            const vacaciones = sueldo * 0.5;
            const cesantias = sueldo;
            const intereses_cesantias = cesantias * 0.12;
            const bonificacion_servicios = sueldo * 0.35;
            const seguridad_social = sueldo * 12 * 0.21;
            const parafiscales = sueldo * 12 * 0.09;
            const costo_anual_total = (sueldo * 12) + prima_servicios + prima_navidad + prima_vacaciones + vacaciones + cesantias + intereses_cesantias + bonificacion_servicios + seguridad_social + parafiscales;
            const inversion_necesaria = costo_anual_total - valorTotalContrato;
            return {
              nombre: fila[0] || "N/A",
              recurso: fila[1] || "N/A",
              nivel: fila[2] || "N/A",
              tipo_funcion: fila[3] || "N/A",
              centro_costo: fila[4] || "N/A",
              contratos: fila[5] || "N/A",
              valor_total_contrato: valorTotalContrato,
              salario_mensual: sueldo,
              prima_servicios,
              prima_navidad,
              prima_vacaciones,
              vacaciones,
              cesantias,
              intereses_cesantias,
              bonificacion_servicios,
              seguridad_social,
              parafiscales,
              costo_anual_total,
              inversion_necesaria
            };
          });
          setCpsData(parsedData);
        }
      });
    };
    loadInitialData();
  }, []);

  const calculateFromBudget = (budget: number) => {
    if (data.length === 0) return;
    
    let count = 0;
    let runningActual = 0;
    let runningFormalData = 0;
    
    const maxTeachers = 2000;
    
    for (let i = 0; i < maxTeachers; i++) {
      const d = data[i % data.length];
      runningActual += d.costo_actual;
      
      const puntos_formalizados = d.puntos_actuales + PUNTOS_FORMALIZACION;
      const salario_formalizado = puntos_formalizados * VALOR_PUNTO_2027;
      const costo_formalizado = salario_formalizado * FACTOR_PRESTACIONAL;
      const bonificacion = salario_formalizado * BONIFICACION_RATE;
      
      runningFormalData += costo_formalizado + bonificacion;
      
      const currentCount = i + 1;
      const numCat2 = Math.floor(currentCount / 2);
      const numCat1 = currentCount % 2;
      const costo_catedraticos = ((numCat2 * COSTO_CATEDRATICO_2) + (numCat1 * COSTO_CATEDRATICO_1)) * AUMENTO_CATEDRATICOS_2027;
      
      const formal = runningFormalData + costo_catedraticos;
      const inversion = formal - runningActual;
      
      if (inversion <= budget) {
        count = currentCount;
      } else {
        break;
      }
    }
    
    setSimPop(data.length > 0 ? (count / data.length) * 100 : 0);
  };

  const calculateCPSFromBudget = (budget: number) => {
    if (cpsData.length === 0) return;
    let cumulativeInversion = 0;
    let count = 0;
    // Sort by inversion needed (cheapest first) to maximize number of contracts
    const sorted = [...cpsData].sort((a, b) => a.inversion_necesaria - b.inversion_necesaria);
    for (const item of sorted) {
      if (cumulativeInversion + item.inversion_necesaria <= budget) {
        cumulativeInversion += item.inversion_necesaria;
        count++;
      } else {
        break;
      }
    }
    setCpsSimCount(count);
  };

  const kpis = useMemo(() => {
    if (data.length === 0) return { 
      total: 0, 
      avg: 0, 
      gap: 0, 
      budget: 0, 
      costo_actual_total: 0, 
      costo_formal_total: 0,
      bonificacion_total: 0,
      costo_escalafon: 0
    };
    
    const total = data.length;
    const costo_actual_total = data.reduce((acc, curr) => acc + curr.costo_actual_total, 0);
    const costo_formal_total_sin_cat = data.reduce((acc, curr) => acc + curr.costo_formalizado_total, 0);
    const bonificacion_total = data.reduce((acc, curr) => acc + curr.bonificacion, 0);
    const costo_escalafon = data.reduce((acc, curr) => acc + (curr.costo_formalizado_total - curr.bonificacion - curr.costo_actual_total), 0);
    
    // Catedraticos logic
    const numCat2 = Math.floor(total / 2);
    const numCat1 = total % 2;
    const costo_catedraticos_total = (numCat2 * COSTO_CATEDRATICO_2) + (numCat1 * COSTO_CATEDRATICO_1);
    
    const costo_formal_total = costo_formal_total_sin_cat + costo_catedraticos_total;
    const avg = costo_formal_total / total;
    const budget = costo_formal_total;
    const inversion = costo_formal_total - costo_actual_total;
    const gap = costo_actual_total > 0 ? (inversion / costo_actual_total) * 100 : 0;
    
    return {
      total,
      avg,
      gap,
      budget,
      costo_actual_total,
      costo_formal_total,
      bonificacion_total,
      costo_escalafon
    };
  }, [data]);

  const calculateAdminCosts = (sueldo: number, count: number) => {
    const mensual_base = sueldo * count;
    const anual_base = mensual_base * 12;
    const prima_servicios = (sueldo * 0.5) * count;
    const prima_navidad = (sueldo * 1.0) * count;
    const prima_vacaciones = (sueldo * 0.5) * count;
    const vacaciones = (sueldo * 0.5) * count;
    const cesantias = (sueldo * 1.0) * count;
    const intereses_cesantias = (cesantias * 0.12);
    const bonificacion = (sueldo * 0.35) * count;
    const seguridad_social = anual_base * 0.21;
    const parafiscales = anual_base * 0.09;
    const total_prestaciones = prima_servicios + prima_navidad + prima_vacaciones + vacaciones + cesantias + intereses_cesantias + bonificacion;
    const total_carga = seguridad_social + parafiscales;
    const gran_total = anual_base + total_prestaciones + total_carga;
    const inversion = gran_total - anual_base;
    return {
      mensual_base, anual_base, prima_servicios, prima_navidad, prima_vacaciones,
      vacaciones, cesantias, intereses_cesantias, bonificacion, seguridad_social,
      parafiscales, total_prestaciones, total_carga, gran_total, inversion
    };
  };

  const adminSimResults = useMemo(() => {
    const res2026 = calculateAdminCosts(adminSimSalary, adminSimCount);
    const res2027 = calculateAdminCosts(adminSimSalary * AUMENTO_SALARIAL_2027, adminSimCount);
    
    return {
      ...res2026,
      escenario_2027: res2027
    };
  }, [adminSimSalary, adminSimCount]);

  const adminKpis = useMemo(() => {
    if (adminData.length === 0) return { 
      total: 0, 
      costo_anual_total: 0, 
      costo_mensual_total: 0,
      total_primas: 0,
      total_cesantias: 0,
      total_seguridad_social: 0,
      total_parafiscales: 0,
      total_bonificaciones: 0,
      total_vacaciones: 0
    };
    
    const total = adminData.length;
    const costo_mensual_total = adminData.reduce((acc, curr) => acc + curr.sueldo, 0);
    const total_primas = adminData.reduce((acc, curr) => acc + curr.prima_servicios + curr.prima_navidad + curr.prima_vacaciones, 0);
    const total_cesantias = adminData.reduce((acc, curr) => acc + curr.cesantias + curr.intereses_cesantias, 0);
    const total_seguridad_social = adminData.reduce((acc, curr) => acc + curr.seguridad_social, 0);
    const total_parafiscales = adminData.reduce((acc, curr) => acc + curr.parafiscales, 0);
    const total_bonificaciones = adminData.reduce((acc, curr) => acc + curr.bonificacion_servicios, 0);
    const total_vacaciones = adminData.reduce((acc, curr) => acc + curr.vacaciones, 0);
    const costo_anual_total = adminData.reduce((acc, curr) => acc + curr.costo_anual_total, 0);
    
    return { 
      total, 
      costo_anual_total, 
      costo_mensual_total,
      total_primas,
      total_cesantias,
      total_seguridad_social,
      total_parafiscales,
      total_bonificaciones,
      total_vacaciones
    };
  }, [adminData]);

  const filteredCPSData = useMemo(() => {
    return cpsData.filter(d => {
      const matchRecurso = cpsFilterRecurso === "TODOS" || d.recurso === cpsFilterRecurso;
      const matchNivel = cpsFilterNivel === "TODOS" || d.nivel === cpsFilterNivel;
      const matchTipo = cpsFilterTipo === "TODOS" || d.tipo_funcion === cpsFilterTipo;
      return matchRecurso && matchNivel && matchTipo;
    });
  }, [cpsData, cpsFilterRecurso, cpsFilterNivel, cpsFilterTipo]);

  const cpsKpis = useMemo(() => {
    if (filteredCPSData.length === 0) return {
      total: 0,
      valor_total_contratos: 0,
      costo_anual_formalizado: 0,
      inversion_total: 0,
      total_primas: 0,
      total_cesantias: 0,
      total_seguridad_social: 0,
      total_parafiscales: 0,
      total_bonificaciones: 0,
      total_vacaciones: 0
    };
    const total = filteredCPSData.length;
    const valor_total_contratos = filteredCPSData.reduce((acc, curr) => acc + curr.valor_total_contrato, 0);
    const costo_anual_formalizado = filteredCPSData.reduce((acc, curr) => acc + curr.costo_anual_total, 0);
    const inversion_total = filteredCPSData.reduce((acc, curr) => acc + curr.inversion_necesaria, 0);
    
    const total_primas = filteredCPSData.reduce((acc, curr) => acc + curr.prima_servicios + curr.prima_navidad + curr.prima_vacaciones, 0);
    const total_cesantias = filteredCPSData.reduce((acc, curr) => acc + curr.cesantias + curr.intereses_cesantias, 0);
    const total_seguridad_social = filteredCPSData.reduce((acc, curr) => acc + curr.seguridad_social, 0);
    const total_parafiscales = filteredCPSData.reduce((acc, curr) => acc + curr.parafiscales, 0);
    const total_bonificaciones = filteredCPSData.reduce((acc, curr) => acc + curr.bonificacion_servicios, 0);
    const total_vacaciones = filteredCPSData.reduce((acc, curr) => acc + curr.vacaciones, 0);

    return { 
      total, 
      valor_total_contratos, 
      costo_anual_formalizado, 
      inversion_total,
      total_primas,
      total_cesantias,
      total_seguridad_social,
      total_parafiscales,
      total_bonificaciones,
      total_vacaciones
    };
  }, [filteredCPSData]);

  const cpsSimImpact = useMemo(() => {
    if (filteredCPSData.length === 0) return {
      total: 0,
      valor_total_contratos: 0,
      costo_anual_formalizado: 0,
      inversion_total: 0,
      total_primas: 0,
      total_cesantias: 0,
      total_seguridad_social: 0,
      total_parafiscales: 0,
      total_bonificaciones: 0,
      total_vacaciones: 0
    };

    let subset = [...filteredCPSData];
    
    // Apply count limit if set
    if (typeof cpsSimCount === "number" && cpsSimCount > 0) {
      // Sort by inversion needed to be consistent with budget logic
      subset = subset.sort((a, b) => a.inversion_necesaria - b.inversion_necesaria).slice(0, cpsSimCount);
    }

    const calculateCPSCosts = (subset: CPSData[], factor: number = 1) => {
      const total = subset.length;
      const valor_total_contratos = subset.reduce((acc, curr) => acc + curr.valor_total_contrato, 0);
      
      const total_costs = subset.reduce((acc, curr) => {
        const sueldo = curr.salario_mensual * factor;
        const prima_servicios = sueldo * 0.5;
        const prima_navidad = sueldo;
        const prima_vacaciones = sueldo * 0.5;
        const vacaciones = sueldo * 0.5;
        const cesantias = sueldo;
        const intereses_cesantias = cesantias * 0.12;
        const bonificacion_servicios = sueldo * 0.35;
        const seguridad_social = sueldo * 12 * 0.21;
        const parafiscales = sueldo * 12 * 0.09;
        const costo_anual_total = (sueldo * 12) + prima_servicios + prima_navidad + prima_vacaciones + vacaciones + cesantias + intereses_cesantias + bonificacion_servicios + seguridad_social + parafiscales;
        
        return {
          costo_anual_formalizado: acc.costo_anual_formalizado + costo_anual_total,
          total_primas: acc.total_primas + prima_servicios + prima_navidad + prima_vacaciones,
          total_cesantias: acc.total_cesantias + cesantias + intereses_cesantias,
          total_seguridad_social: acc.total_seguridad_social + seguridad_social,
          total_parafiscales: acc.total_parafiscales + parafiscales,
          total_bonificaciones: acc.total_bonificaciones + bonificacion_servicios,
          total_vacaciones: acc.total_vacaciones + vacaciones
        };
      }, {
        costo_anual_formalizado: 0,
        total_primas: 0,
        total_cesantias: 0,
        total_seguridad_social: 0,
        total_parafiscales: 0,
        total_bonificaciones: 0,
        total_vacaciones: 0
      });

      return {
        total,
        valor_total_contratos,
        ...total_costs,
        inversion_total: total_costs.costo_anual_formalizado - valor_total_contratos
      };
    };

    const res2026 = calculateCPSCosts(subset);
    const res2027 = calculateCPSCosts(subset, AUMENTO_SALARIAL_2027);

    return { 
      ...res2026,
      escenario_2027: res2027
    };
  }, [filteredCPSData, cpsSimCount]);

  const cpsIndependentSim = useMemo(() => {
    const VALOR_PROFESIONAL = 3659400;
    const VALOR_TECNICO = 2535900;
    const VALOR_ASISTENCIAL = 2264237;

    const calculateLevel = (sueldo: number, count: number) => {
      if (count <= 0) return {
        costo_actual: 0,
        costo_formalizado: 0,
        primas: 0,
        cesantias: 0,
        seguridad: 0,
        parafiscales: 0,
        bonificaciones: 0,
        vacaciones: 0,
        anual_base: 0
      };

      const mensual_base = sueldo * count;
      const anual_base = mensual_base * 12;
      const costo_actual = sueldo * count * 11;

      const prima_servicios = (sueldo * 0.5) * count;
      const prima_navidad = (sueldo * 1.0) * count;
      const prima_vacaciones = (sueldo * 0.5) * count;
      const vacaciones = (sueldo * 0.5) * count;
      const cesantias = (sueldo * 1.0) * count;
      const intereses_cesantias = (cesantias * 0.12);
      const bonificacion = (sueldo * 0.35) * count;
      
      const seguridad_social = anual_base * 0.21;
      const parafiscales = anual_base * 0.09;

      const total_prestaciones = prima_servicios + prima_navidad + prima_vacaciones + vacaciones + cesantias + intereses_cesantias + bonificacion;
      const total_carga = seguridad_social + parafiscales;
      const costo_formalizado = anual_base + total_prestaciones + total_carga;

      return {
        costo_actual,
        costo_formalizado,
        primas: prima_servicios + prima_navidad + prima_vacaciones,
        cesantias: cesantias + intereses_cesantias,
        seguridad: seguridad_social,
        parafiscales,
        bonificaciones: bonificacion,
        vacaciones,
        anual_base
      };
    };

    const calculateScenario = (factor: number) => {
      const prof = calculateLevel(VALOR_PROFESIONAL * factor, cpsSimProfCount);
      const tec = calculateLevel(VALOR_TECNICO * factor, cpsSimTecCount);
      const asis = calculateLevel(VALOR_ASISTENCIAL * factor, cpsSimAsisCount);

      const total_contratos = cpsSimProfCount + cpsSimTecCount + cpsSimAsisCount;
      const costo_actual_total = prof.costo_actual + tec.costo_actual + asis.costo_actual;
      const costo_formalizado_total = prof.costo_formalizado + tec.costo_formalizado + asis.costo_formalizado;
      const inversion_total = costo_formalizado_total - costo_actual_total;

      return {
        total: total_contratos,
        valor_total_contratos: costo_actual_total,
        costo_anual_formalizado: costo_formalizado_total,
        inversion_total,
        total_primas: prof.primas + tec.primas + asis.primas,
        total_cesantias: prof.cesantias + tec.cesantias + asis.cesantias,
        total_seguridad_social: prof.seguridad + tec.seguridad + asis.seguridad,
        total_parafiscales: prof.parafiscales + tec.parafiscales + asis.parafiscales,
        total_bonificaciones: prof.bonificaciones + tec.bonificaciones + asis.bonificaciones,
        total_vacaciones: prof.vacaciones + tec.vacaciones + asis.vacaciones,
        anual_base: prof.anual_base + tec.anual_base + asis.anual_base,
        mensual_base: (VALOR_PROFESIONAL * factor * cpsSimProfCount) + (VALOR_TECNICO * factor * cpsSimTecCount) + (VALOR_ASISTENCIAL * factor * cpsSimAsisCount)
      };
    };

    const scenario_2026 = calculateScenario(1);
    const scenario_2027 = calculateScenario(AUMENTO_SALARIAL_2027);

    return {
      ...scenario_2026,
      escenario_2027: scenario_2027
    };
  }, [cpsSimProfCount, cpsSimTecCount, cpsSimAsisCount]);

  const cpsFilterOptions = useMemo(() => {
    return {
      recursos: ["TODOS", ...Array.from(new Set(cpsData.map(d => d.recurso)))],
      niveles: ["TODOS", ...Array.from(new Set(cpsData.map(d => d.nivel)))],
      tipos: ["TODOS", ...Array.from(new Set(cpsData.map(d => d.tipo_funcion)))]
    };
  }, [cpsData]);

  const cpsChartData = useMemo(() => {
    const recursoCounts: Record<string, number> = {};
    const nivelCounts: Record<string, number> = {};
    const tipoCounts: Record<string, number> = {};

    filteredCPSData.forEach(d => {
      recursoCounts[d.recurso] = (recursoCounts[d.recurso] || 0) + 1;
      nivelCounts[d.nivel] = (nivelCounts[d.nivel] || 0) + 1;
      tipoCounts[d.tipo_funcion] = (tipoCounts[d.tipo_funcion] || 0) + 1;
    });

    return {
      recurso: Object.entries(recursoCounts).map(([name, value]) => ({ name, value })),
      nivel: Object.entries(nivelCounts).map(([name, value]) => ({ name, value })),
      tipo: Object.entries(tipoCounts).map(([name, value]) => ({ name, value }))
    };
  }, [filteredCPSData]);

  const cpsSummaryTable = useMemo(() => {
    const summary: Record<string, { misional: number; apoyo: number; convenio: number; niveles: Record<string, number> }> = {};
    
    filteredCPSData.forEach(d => {
      if (!summary[d.centro_costo]) {
        summary[d.centro_costo] = { misional: 0, apoyo: 0, convenio: 0, niveles: {} };
      }
      
      const tipo = d.tipo_funcion.toUpperCase();
      if (tipo.includes("MISIONAL")) summary[d.centro_costo].misional++;
      else if (tipo.includes("APOYO")) summary[d.centro_costo].apoyo++;
      else if (tipo.includes("CONVENIO")) summary[d.centro_costo].convenio++;
      
      summary[d.centro_costo].niveles[d.nivel] = (summary[d.centro_costo].niveles[d.nivel] || 0) + 1;
    });
    
    return summary;
  }, [filteredCPSData]);

  const adminCargoData = useMemo(() => {
    const counts: Record<string, { count: number; cost: number }> = {};
    adminData.forEach(d => {
      if (!counts[d.cargo]) counts[d.cargo] = { count: 0, cost: 0 };
      counts[d.cargo].count += 1;
      counts[d.cargo].cost += d.costo_anual_total;
    });
    return Object.entries(counts).map(([name, val]) => ({ name, value: val.count, cost: val.cost }));
  }, [adminData]);

  const adminClasificacionData = useMemo(() => {
    const groups: Record<string, { count: number; monthly: number; total: number }> = {};
    adminData.forEach(d => {
      if (!groups[d.clasificacion]) groups[d.clasificacion] = { count: 0, monthly: 0, total: 0 };
      groups[d.clasificacion].count += 1;
      groups[d.clasificacion].monthly += d.sueldo;
      groups[d.clasificacion].total += d.costo_anual_total;
    });
    return Object.entries(groups).map(([name, val]) => ({ name, ...val }));
  }, [adminData]);

  const [adminFilterClasificacion, setAdminFilterClasificacion] = useState<string>("TODOS");

  const adminClassifications = useMemo(() => {
    const classes = new Set(adminData.map(d => d.clasificacion));
    return ["TODOS", ...Array.from(classes)];
  }, [adminData]);

  const adminFilteredCargoData = useMemo(() => {
    const filtered = adminFilterClasificacion === "TODOS" 
      ? adminData 
      : adminData.filter(d => d.clasificacion === adminFilterClasificacion);
    
    const counts: Record<string, number> = {};
    filtered.forEach(d => {
      counts[d.cargo] = (counts[d.cargo] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [adminData, adminFilterClasificacion]);

  const vinculacionData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(d => {
      counts[d.tipo_vinculacion] = (counts[d.tipo_vinculacion] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const boxPlotData = useMemo(() => {
    if (data.length === 0) return [];

    const getStats = (values: number[]) => {
      const sorted = [...values].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const median = sorted[Math.floor(sorted.length * 0.5)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      return { min, q1, median, q3, max };
    };

    const actualStats = getStats(data.map(d => d.salario_actual));
    const formalStats = getStats(data.map(d => d.salario_formalizado));

    return [
      {
        name: 'Actual',
        ...actualStats,
        // For stacked bar representation:
        low: actualStats.min,
        q1_low: actualStats.q1 - actualStats.min,
        median_q1: actualStats.median - actualStats.q1,
        q3_median: actualStats.q3 - actualStats.median,
        high_q3: actualStats.max - actualStats.q3,
      },
      {
        name: 'Formalizado',
        ...formalStats,
        low: formalStats.min,
        q1_low: formalStats.q1 - formalStats.min,
        median_q1: formalStats.median - formalStats.q1,
        q3_median: formalStats.q3 - formalStats.median,
        high_q3: formalStats.max - formalStats.q3,
      }
    ];
  }, [data]);

  const chartData = useMemo(() => {
    const categories = ["Instructor", "Asistente", "Asociado", "Titular"];
    return categories.map(cat => {
      const subset = data.filter(d => d.categoria.includes(cat));
      const avgActual = subset.length ? subset.reduce((a, b) => a + b.salario_actual, 0) / subset.length : 0;
      const avgFormal = subset.length ? subset.reduce((a, b) => a + b.salario_formalizado, 0) / subset.length : 0;
      return { name: cat, actual: avgActual, formalizado: avgFormal };
    });
  }, [data]);

  const pointsDistributionData = useMemo(() => {
    if (data.length === 0) return [];
    const points = data.map(d => d.puntos_actuales);
    const min = Math.floor(Math.min(...points) / 10) * 10;
    const max = Math.ceil(Math.max(...points) / 10) * 10;
    const binSize = 10;
    const bins: { [key: number]: number } = {};
    for (let i = min; i <= max; i += binSize) {
      bins[i] = 0;
    }
    points.forEach(p => {
      const bin = Math.floor(p / binSize) * binSize;
      if (bins[bin] !== undefined) {
        bins[bin]++;
      }
    });
    return Object.keys(bins).map(key => ({
      range: parseInt(key),
      count: bins[parseInt(key)]
    })).sort((a, b) => a.range - b.range);
  }, [data]);

  const simImpact = useMemo(() => {
    if (data.length === 0) return { 
      inversion: 0, actual: 0, formal: 0, n: 0, inc: 0,
      avg_salario_actual: 0, avg_salario_formal: 0,
      costo_escalafon: 0, bonificacion: 0, costo_formal_sin_bonif: 0
    };
    const nSim = Math.ceil(data.length * (simPop / 100));
    let subset: TeacherData[] = [];
    if (nSim <= data.length) {
      subset = data.slice(0, nSim);
    } else {
      const fullCopies = Math.floor(nSim / data.length);
      const remainder = nSim % data.length;
      for (let i = 0; i < fullCopies; i++) {
        subset = subset.concat(data);
      }
      subset = subset.concat(data.slice(0, remainder));
    }
    
    const calculateDocenteCosts = (subset: TeacherData[], valorPunto: number, factorCatedratico: number = 1) => {
      const actual = subset.reduce((acc, d) => acc + d.costo_actual, 0);
      
      const formal_data = subset.reduce((acc, d) => {
        const puntos_formalizados = d.puntos_actuales + PUNTOS_FORMALIZACION;
        const salario_formalizado = puntos_formalizados * valorPunto;
        const costo_formalizado = salario_formalizado * FACTOR_PRESTACIONAL;
        const bonificacion = salario_formalizado * BONIFICACION_RATE;
        const costo_formalizado_total = costo_formalizado + bonificacion;
        
        return {
          formal_sin_cat: acc.formal_sin_cat + costo_formalizado_total,
          costo_escalafon: acc.costo_escalafon + (PUNTOS_FORMALIZACION * valorPunto * FACTOR_PRESTACIONAL),
          bonificacion: acc.bonificacion + bonificacion,
          avg_salario_formal: acc.avg_salario_formal + salario_formalizado
        };
      }, {
        formal_sin_cat: 0,
        costo_escalafon: 0,
        bonificacion: 0,
        avg_salario_formal: 0
      });

      const numCat2 = Math.floor(subset.length / 2);
      const numCat1 = subset.length % 2;
      const costo_catedraticos = ((numCat2 * COSTO_CATEDRATICO_2) + (numCat1 * COSTO_CATEDRATICO_1)) * factorCatedratico;
      
      const formal = formal_data.formal_sin_cat + costo_catedraticos;
      const inversion = formal - actual;
      const inc = actual > 0 ? ((formal / actual) - 1) * 100 : 0;
      const avg_salario_actual = subset.length > 0 ? subset.reduce((acc, d) => acc + d.salario_actual, 0) / subset.length : 0;
      const avg_salario_formal = subset.length > 0 ? formal_data.avg_salario_formal / subset.length : 0;

      return {
        actual,
        formal,
        inversion,
        inc,
        avg_salario_actual,
        avg_salario_formal,
        costo_escalafon: formal_data.costo_escalafon,
        bonificacion: formal_data.bonificacion,
        costo_catedraticos,
        costo_base: formal_data.formal_sin_cat - formal_data.bonificacion - formal_data.costo_escalafon,
        costo_formal_sin_bonif: formal_data.formal_sin_cat - formal_data.bonificacion,
        n: subset.length
      };
    };

    const res2026 = calculateDocenteCosts(subset, VALOR_PUNTO_2026, 1);
    const res2027 = calculateDocenteCosts(subset, VALOR_PUNTO_2027, AUMENTO_CATEDRATICOS_2027);

    return { 
      ...res2026,
      escenario_2027: res2027
    };
  }, [data, simPop]);

  const [countDoc1, setCountDoc1] = useState(40);
  const [countCPSProf1, setCountCPSProf1] = useState(10);
  const [countCPSTec1, setCountCPSTec1] = useState(10);
  const [countCPSAsis1, setCountCPSAsis1] = useState(10);

  const [countDoc2, setCountDoc2] = useState(80);
  const [countCPSProf2, setCountCPSProf2] = useState(20);
  const [countCPSTec2, setCountCPSTec2] = useState(20);
  const [countCPSAsis2, setCountCPSAsis2] = useState(20);

  const formalizationSummary = useMemo(() => {
    if (data.length === 0 || cpsData.length === 0) return { 
      year1: { docente: { n: 0, inv: 0 }, cps: { prof: 0, tec: 0, asis: 0, inv: 0 }, total: 0 }, 
      year2: { docente: { n: 0, inv: 0 }, cps: { prof: 0, tec: 0, asis: 0, inv: 0 }, total: 0 }, 
      grandTotal: 0 
    };

    const calculateDocenteInversion = (subset: TeacherData[], valorPunto: number, factorCatedratico: number = 1) => {
      const actual = subset.reduce((acc, d) => acc + d.costo_actual, 0);
      const formal_data = subset.reduce((acc, d) => {
        const puntos_formalizados = d.puntos_actuales + PUNTOS_FORMALIZACION;
        const salario_formalizado = puntos_formalizados * valorPunto;
        const costo_formalizado = salario_formalizado * FACTOR_PRESTACIONAL;
        const bonificacion = salario_formalizado * BONIFICACION_RATE;
        return acc + costo_formalizado + bonificacion;
      }, 0);
      const numCat2 = Math.floor(subset.length / 2);
      const numCat1 = subset.length % 2;
      const costo_catedraticos = ((numCat2 * COSTO_CATEDRATICO_2) + (numCat1 * COSTO_CATEDRATICO_1)) * factorCatedratico;
      return (formal_data + costo_catedraticos) - actual;
    };

    const calculateCPSInversion = (subset: CPSData[], factor: number = 1) => {
      const VALOR_PROFESIONAL = 3659400;
      const VALOR_TECNICO = 2535900;
      const VALOR_ASISTENCIAL = 2264237;

      return subset.reduce((acc, d) => {
        let sueldoBase = 0;
        const nivel = d.nivel.toUpperCase();
        if (nivel.includes("PROFESIONAL")) sueldoBase = VALOR_PROFESIONAL;
        else if (nivel.includes("TECNICO")) sueldoBase = VALOR_TECNICO;
        else if (nivel.includes("ASISTENCIAL")) sueldoBase = VALOR_ASISTENCIAL;
        else sueldoBase = d.salario_mensual;

        const sueldo = sueldoBase * factor;
        const costo_formalizado = sueldo * 19.57;
        const costo_actual = sueldo * 11; // Matching the manual simulator's assumption of current cost
        return acc + (costo_formalizado - costo_actual);
      }, 0);
    };

    const profs = cpsData.filter(d => d.nivel === "PROFESIONAL");
    const tecs = cpsData.filter(d => d.nivel === "TECNICO");
    const asis = cpsData.filter(d => d.nivel === "ASISTENCIAL");

    // Year 1
    const nDoc1 = Math.min(countDoc1, data.length);
    const subsetDoc1 = data.slice(0, nDoc1);
    const invDoc1 = calculateDocenteInversion(subsetDoc1, VALOR_PUNTO_2027, AUMENTO_CATEDRATICOS_2027);

    const nCPSProf1 = Math.min(countCPSProf1, profs.length);
    const nCPSTec1 = Math.min(countCPSTec1, tecs.length);
    const nCPSAsis1 = Math.min(countCPSAsis1, asis.length);

    const subsetCPS1 = [
      ...profs.slice(0, nCPSProf1),
      ...tecs.slice(0, nCPSTec1),
      ...asis.slice(0, nCPSAsis1)
    ];
    const invCPS1 = calculateCPSInversion(subsetCPS1, 1);

    // Year 2
    const nDoc2 = Math.min(countDoc2, data.length - nDoc1);
    const subsetDoc2 = data.slice(nDoc1, nDoc1 + nDoc2);
    const invDoc2 = calculateDocenteInversion(subsetDoc2, VALOR_PUNTO_2027, AUMENTO_CATEDRATICOS_2027);

    const nCPSProf2 = Math.min(countCPSProf2, profs.length - nCPSProf1);
    const nCPSTec2 = Math.min(countCPSTec2, tecs.length - nCPSTec1);
    const nCPSAsis2 = Math.min(countCPSAsis2, asis.length - nCPSAsis1);

    const subsetCPS2 = [
      ...profs.slice(nCPSProf1, nCPSProf1 + nCPSProf2),
      ...tecs.slice(nCPSTec1, nCPSTec1 + nCPSTec2),
      ...asis.slice(nCPSAsis1, nCPSAsis1 + nCPSAsis2)
    ];
    const invCPS2 = calculateCPSInversion(subsetCPS2, 1);

    return {
      year1: { 
        docente: { n: nDoc1, inv: invDoc1 }, 
        cps: { prof: nCPSProf1, tec: nCPSTec1, asis: nCPSAsis1, inv: invCPS1 }, 
        total: invDoc1 + invCPS1 
      },
      year2: { 
        docente: { n: nDoc2, inv: invDoc2 }, 
        cps: { prof: nCPSProf2, tec: nCPSTec2, asis: nCPSAsis2, inv: invCPS2 }, 
        total: invDoc2 + invCPS2 
      },
      grandTotal: (invDoc1 + invCPS1) + (invDoc2 + invCPS2)
    };
  }, [data, cpsData, countDoc1, countCPSProf1, countCPSTec1, countCPSAsis1, countDoc2, countCPSProf2, countCPSTec2, countCPSAsis2]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessages = [...chatMessages, { role: "user" as const, text: userInput }];
    setChatMessages(newMessages);
    const currentInput = userInput;
    setUserInput("");
    setIsTyping(true);

    // Logic to detect budget queries
    let budgetProjection = "";
    const numberMatch = currentInput.match(/(\d+)/);
    const isFormalizarQuery = currentInput.toLowerCase().includes("formalizar") || currentInput.toLowerCase().includes("costo") || currentInput.toLowerCase().includes("cuesta");
    
    if (numberMatch && isFormalizarQuery) {
      const value = parseInt(numberMatch[1]);
      
      // Case 1: User provides an amount of money
      if (value > 1000000 || currentInput.toLowerCase().includes("millones") || currentInput.toLowerCase().includes("presupuesto")) {
        let amount = value;
        if (currentInput.toLowerCase().includes("millones")) amount *= 1000000;
        
        let cumulativeInversion = 0;
        let count = 0;
        const sortedTeachers = [...data].sort((a, b) => (a.costo_formalizado_total - a.costo_actual) - (b.costo_formalizado_total - b.costo_actual));
        for (const teacher of sortedTeachers) {
          const inv = teacher.costo_formalizado_total - teacher.costo_actual;
          if (cumulativeInversion + inv <= amount) {
            cumulativeInversion += inv;
            count++;
          } else {
            break;
          }
        }
        budgetProjection = `PROYECCIÓN POR PRESUPUESTO: Con $${amount.toLocaleString()}, se formalizan ${count} docentes. Inversión: $${cumulativeInversion.toLocaleString()}.`;
      } 
      // Case 2: User asks for a specific number of teachers
      else if (value > 0 && value <= data.length) {
        const sortedTeachers = [...data].sort((a, b) => (a.costo_formalizado_total - a.costo_actual) - (b.costo_formalizado_total - b.costo_actual));
        const subset = sortedTeachers.slice(0, value);
        const totalCost = subset.reduce((acc, d) => acc + (d.costo_formalizado_total - d.costo_actual), 0);
        budgetProjection = `PROYECCIÓN POR CANTIDAD: Formalizar ${value} docentes cuesta $${(totalCost / 1000000).toFixed(2)}M.`;
      }
    }

    const avgSalarioActual = data.length > 0 ? data.reduce((acc, d) => acc + d.salario_actual, 0) / data.length : 0;
    const avgSalarioFormal = data.length > 0 ? data.reduce((acc, d) => acc + d.salario_formalizado, 0) / data.length : 0;

    const context = `El usuario está interactuando con el Sistema de Decisiones Basadas en Analítica de Datos de la UPTC.
      
      ESTADÍSTICAS DOCENTES:
      - Total docentes: ${data.length}
      - Salario Promedio Actual: $${avgSalarioActual.toLocaleString()}
      - Salario Promedio Formalizado: $${avgSalarioFormal.toLocaleString()}
      - Costo Actual Total (Anual): $${(kpis.costo_actual_total / 1000000).toFixed(2)}M
      - Costo Formalizado Total (Anual): $${(kpis.costo_formal_total / 1000000).toFixed(2)}M
      - Inversión Total Docente: $${((kpis.costo_formal_total - kpis.costo_actual_total) / 1000000).toFixed(2)}M
      
      ESTADÍSTICAS ADMINISTRATIVOS:
      - Total administrativos: ${adminData.length}
      - Costo Anual Total Admins: $${(adminKpis.costo_anual_total / 1000000).toFixed(2)}M
      - Inversión Necesaria Admins: $${(adminKpis.inversion_total / 1000000).toFixed(2)}M
      
      ESTADÍSTICAS CPS:
      - Total contratos CPS: ${cpsData.length}
      - Valor Total Contratos: $${(cpsKpis.valor_total_contratos / 1000000).toFixed(2)}M
      - Inversión Necesaria CPS: $${(cpsKpis.inversion_total / 1000000).toFixed(2)}M
      
      PROYECCIÓN DE FORMALIZACIÓN (AÑOS 1 Y 2):
      - Año 1: $${(formalizationSummary.year1.total / 1000000).toFixed(2)}M (Docentes: ${formalizationSummary.year1.docente.n}, Inversión: $${(formalizationSummary.year1.docente.inv / 1000000).toFixed(2)}M)
      - Año 2: $${(formalizationSummary.year2.total / 1000000).toFixed(2)}M (Docentes: ${formalizationSummary.year2.docente.n}, Inversión: $${(formalizationSummary.year2.docente.inv / 1000000).toFixed(2)}M)
      - Gran Total Proyectado: $${(formalizationSummary.grandTotal / 1000000).toFixed(2)}M
      
      DATOS DE SIMULACIÓN CPS (MANUAL):
      - Total contratos en simulación manual: ${cpsIndependentSim.total} (Prof: ${cpsSimProfCount}, Tec: ${cpsSimTecCount}, Asis: ${cpsSimAsisCount})
      - Inversión en esta simulación CPS: $${(cpsIndependentSim.inversion_total / 1000000).toFixed(2)}M
      - Costo Actual (11 meses): $${(cpsIndependentSim.valor_total_contratos / 1000000).toFixed(2)}M
      - Costo Formalizado: $${(cpsIndependentSim.costo_anual_formalizado / 1000000).toFixed(2)}M
      
      DATOS DE SIMULACIÓN DOCENTE:
      - Población en simulación: ${simImpact.n} docentes (${simPop}%)
      - Inversión en esta simulación: $${(simImpact.inversion / 1000000).toFixed(2)}M
      
      PARÁMETROS DE CÁLCULO:
      - Valor Punto 2027: $${VALOR_PUNTO_2027}
      - Puntos Formalización: ${PUNTOS_FORMALIZACION}
      - Factor Prestacional: ${FACTOR_PRESTACIONAL}
      - Bonificación Rate: ${BONIFICACION_RATE}
      
      ${budgetProjection ? `CÁLCULO DE PROYECCIÓN AUTOMÁTICO: ${budgetProjection}` : ""}
      
      INSTRUCCIÓN: Eres "Centavito", el asistente virtual y chatbot del Sistema de Decisiones Basadas en Analítica de Datos de la UPTC.
      Tu objetivo principal es ayudar al usuario a entender los datos, simular escenarios y proyectar costos de formalización laboral (Docentes, Administrativos y CPS).
      Tienes la capacidad de simular basado en los simuladores del DASHBOARD. Si el usuario te pide simular algo (por ejemplo: "¿Cuánto cuesta formalizar 50 docentes?" o "¿Qué pasa si formalizamos 10 profesionales CPS?"), utiliza los promedios y datos proporcionados arriba para calcular una estimación rápida y darle una respuesta clara y directa.
      Responde de forma concreta, amable y profesional, utilizando un lenguaje fácil de entender.
      
      Pregunta del usuario: ${currentInput}`;

    const response = await getGeminiResponse(context);
    setChatMessages([...newMessages, { role: "bot", text: response || "No pude obtener respuesta." }]);
    setIsTyping(false);
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    const originalStyle = contentRef.current.style.cssText;
    contentRef.current.style.height = "max-content";
    contentRef.current.style.maxHeight = "none";
    contentRef.current.style.overflow = "visible";
    contentRef.current.style.flex = "none";
    
    // Allow DOM to update layout before capturing
    await new Promise(resolve => setTimeout(resolve, 150));
    
    try {
      const dataUrl = await toPng(contentRef.current, {
        pixelRatio: 2,
        backgroundColor: "#f3f4f6",
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`reporte-uptc-${activeTab}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor, intente de nuevo.");
    } finally {
      contentRef.current.style.cssText = originalStyle;
    }
  };

  const handleDownloadCSVReport = () => {
    if (data.length === 0) return;
    
    const reportData = data.map(d => ({
      Nombre: d.nombre,
      Categoria: d.categoria,
      Puntos_Actuales: d.puntos_actuales,
      Salario_Actual: d.salario_actual,
      Salario_Formalizado: d.salario_formalizado,
      Costo_Actual_Total: d.costo_actual,
      Costo_Formalizado_Total: d.costo_formalizado_total,
      Inversion_Necesaria: d.costo_formalizado_total - d.costo_actual
    }));

    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte_formalizacion_docente.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (activeTab === "landing") {
    return (
      <LandingPage 
        onStartDocente={() => setActiveTab("resumen")} 
        onStartAdmin={() => setActiveTab("admin_resumen")} 
        onStartCPS={() => setActiveTab("cps_resumen")}
        onStartModeloTecnico={() => setActiveTab("modelo_tecnico")}
        onStartCostoFormalizacion={() => setActiveTab("costo_formalizacion")}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-uptc-black text-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 mb-4">
          <img crossOrigin="anonymous"
            alt="UPTC Logo" 
            className="w-full h-auto" 
            src="https://raw.githubusercontent.com/fabiancho0724/CSV-Simulador/7c20b9207ee45e0e54715cea26798ffff981146a/uptc-blanco%20(1).png" 
          />
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="pb-2 px-4 text-[10px] font-black uppercase text-white/40 tracking-widest">General</div>
          <SidebarItem 
            icon={Home} 
            label="Volver a Portada" 
            active={false} 
            onClick={() => setActiveTab("landing")} 
          />
          <SidebarItem 
            icon={BookOpen} 
            label="Modelo Técnico" 
            active={activeTab === "modelo_tecnico"} 
            onClick={() => setActiveTab("modelo_tecnico")} 
          />
          
          {(activeTab === "resumen" || activeTab === "simulador" || activeTab === "reporte") && (
            <>
              <div className="pt-4 pb-2 px-4 text-[10px] font-black uppercase text-white/40 tracking-widest">Docentes</div>
              <SidebarItem 
                icon={LayoutDashboard} 
                label="Resumen" 
                active={activeTab === "resumen"} 
                onClick={() => setActiveTab("resumen")} 
              />
              <SidebarItem 
                icon={SlidersHorizontal} 
                label="Simulador" 
                active={activeTab === "simulador"} 
                onClick={() => setActiveTab("simulador")} 
              />
              <SidebarItem 
                icon={FileText} 
                label="Reporte" 
                active={activeTab === "reporte"} 
                onClick={() => setActiveTab("reporte")} 
              />
              <SidebarItem 
                icon={DollarSign} 
                label="Costo Formalización" 
                active={activeTab === "costo_formalizacion"} 
                onClick={() => setActiveTab("costo_formalizacion")} 
              />
              <div className="pt-8 mt-8 border-t border-white/10">
                <button 
                  onClick={() => setActiveTab("admin_resumen")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/60 hover:text-uptc-yellow hover:bg-white/5 rounded-xl transition-all"
                >
                  <Users size={18} />
                  Ir a Administrativos
                </button>
                <button 
                  onClick={() => setActiveTab("cps_resumen")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/60 hover:text-uptc-yellow hover:bg-white/5 rounded-xl transition-all mt-2"
                >
                  <Users size={18} />
                  Ir a CPS
                </button>
              </div>
            </>
          )}

          {(activeTab === "admin_resumen" || activeTab === "admin_reporte" || activeTab === "admin_simulador") && (
            <>
              <div className="pt-4 pb-2 px-4 text-[10px] font-black uppercase text-white/40 tracking-widest">Administrativos</div>
              <SidebarItem 
                icon={LayoutDashboard} 
                label="Resumen Admins" 
                active={activeTab === "admin_resumen"} 
                onClick={() => setActiveTab("admin_resumen")} 
              />
              <SidebarItem 
                icon={SlidersHorizontal} 
                label="Simulador Admins" 
                active={activeTab === "admin_simulador"} 
                onClick={() => setActiveTab("admin_simulador")} 
              />
              <SidebarItem 
                icon={FileText} 
                label="Reporte Admins" 
                active={activeTab === "admin_reporte"} 
                onClick={() => setActiveTab("admin_reporte")} 
              />
              <div className="pt-8 mt-8 border-t border-white/10">
                <button 
                  onClick={() => setActiveTab("resumen")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/60 hover:text-uptc-yellow hover:bg-white/5 rounded-xl transition-all"
                >
                  <Users size={18} />
                  Ir a Docentes
                </button>
                <button 
                  onClick={() => setActiveTab("cps_resumen")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/60 hover:text-uptc-yellow hover:bg-white/5 rounded-xl transition-all mt-2"
                >
                  <Users size={18} />
                  Ir a CPS
                </button>
              </div>
            </>
          )}

          {(activeTab === "cps_resumen" || activeTab === "cps_simulador" || activeTab === "cps_reporte") && (
            <>
              <div className="pt-4 pb-2 px-4 text-[10px] font-black uppercase text-white/40 tracking-widest">CPS</div>
              <SidebarItem 
                icon={LayoutDashboard} 
                label="Resumen CPS" 
                active={activeTab === "cps_resumen"} 
                onClick={() => setActiveTab("cps_resumen")} 
              />
              <SidebarItem 
                icon={SlidersHorizontal} 
                label="Simulador CPS" 
                active={activeTab === "cps_simulador"} 
                onClick={() => setActiveTab("cps_simulador")} 
              />
              <SidebarItem 
                icon={FileText} 
                label="Reporte CPS" 
                active={activeTab === "cps_reporte"} 
                onClick={() => setActiveTab("cps_reporte")} 
              />
              <div className="pt-8 mt-8 border-t border-white/10">
                <button 
                  onClick={() => setActiveTab("resumen")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/60 hover:text-uptc-yellow hover:bg-white/5 rounded-xl transition-all"
                >
                  <Users size={18} />
                  Ir a Docentes
                </button>
                <button 
                  onClick={() => setActiveTab("admin_resumen")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/60 hover:text-uptc-yellow hover:bg-white/5 rounded-xl transition-all mt-2"
                >
                  <Users size={18} />
                  Ir a Administrativos
                </button>
              </div>
            </>
          )}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-uptc-yellow flex items-center justify-center text-xs font-bold text-uptc-black">AD</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Admin UPTC</p>
              <p className="text-xs text-white/50 truncate">admin@uptc.edu.co</p>
            </div>
          </div>
          <div className="mt-4 px-4 text-[10px] text-white/40 font-medium leading-relaxed border-t border-white/5 pt-4">
            ©Fabián L. Cely – VAFI – Universidad Pedagógica y Tecnológica de Colombia
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-bold text-uptc-black uppercase tracking-wider">
              {activeTab === "resumen" ? "Resumen de Análisis Salarial Docente" : 
               activeTab === "simulador" ? "Simulador de Impacto Presupuestal Docente" : 
               activeTab === "admin_resumen" ? "Dashboard Administrativo" :
               activeTab === "admin_simulador" ? "Simulador de Planta Administrativa" :
               activeTab === "admin_reporte" ? "Reporte Administrativos" :
               activeTab === "modelo_tecnico" ? "Reporte Técnico del Modelo Matemático" :
               activeTab === "costo_formalizacion" ? "Proyección de Costos de Formalización" :
               "Reporte"}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                className="pl-10 pr-4 py-1.5 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-uptc-yellow w-64" 
                placeholder="Buscar registros..." 
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:text-uptc-black transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === "resumen" && (
              <motion.div
                key="resumen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-uptc-black tracking-tight">Visualización de Equidad</h2>
                    <p className="text-gray-500 mt-1 font-medium italic">Análisis multidimensional de la estructura salarial docente.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <FileDown size={18} />
                      PDF
                    </button>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <KPICard title="Costo Actual Total" value={`$${(simImpact.actual / 1000000).toFixed(1)}M`} icon={FileText} label="Base" />
                  <KPICard title="Costo Formalizado" value={`$${(simImpact.escenario_2027.formal / 1000000).toFixed(1)}M`} icon={FileText} color="uptc-black" label="Objetivo" />
                  <KPICard title="Docentes" value={simImpact.n} icon={LayoutDashboard} />
                  <KPICard title="% Aumento" value={`${simImpact.escenario_2027.inc.toFixed(2)}%`} icon={SlidersHorizontal} color="red-500" />
                  <KPICard title="Inversión Necesaria" value={`$${((simImpact.escenario_2027.formal - simImpact.actual) / 1000000).toFixed(1)}M`} icon={FileText} />
                </div>

                {/* Comparación General de Escenarios Table (Simulado) */}
                <div className="bg-white text-uptc-black p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                    Comparación General de Escenarios (Simulado)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-gray-400 border-b border-gray-100">
                        <tr>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Escenario</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Escalafón</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Bonificación</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Catedráticos</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Diferencia</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Total Anual</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 font-bold">Actual</td>
                          <td className="px-4 py-4 text-gray-500">$0</td>
                          <td className="px-4 py-4 text-gray-500">$0</td>
                          <td className="px-4 py-4 text-gray-500">$0</td>
                          <td className="px-4 py-4 text-gray-500">$0</td>
                          <td className="px-4 py-4 text-uptc-black font-black">${simImpact.actual?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors bg-uptc-yellow/5">
                          <td className="px-4 py-4 font-bold text-uptc-black">Formalización</td>
                          <td className="px-4 py-4 text-gray-500">
                            ${simImpact.escenario_2027.costo_escalafon?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-4 py-4 text-gray-500">${simImpact.escenario_2027.bonificacion.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className="px-4 py-4 text-gray-500">${simImpact.escenario_2027.costo_catedraticos.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className="px-4 py-4 text-gray-500 text-green-600 font-bold">+${(simImpact.escenario_2027.formal - simImpact.actual).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className="px-4 py-4 text-uptc-black font-black">${simImpact.escenario_2027.formal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Added Chart from Simulator removed */}

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white text-uptc-black p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                      Docentes por Tipo de Vinculación
                    </h3>
                    <div className="h-[300px]">
                      {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={vinculacionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                            >
                              {vinculacionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? "#FFCC29" : "#1A1A1A"} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            />
                            <Legend verticalAlign="bottom" align="center" />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <LayoutDashboard size={48} className="opacity-20 mb-2" />
                          <p>Cargue datos para ver la vinculación</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white text-uptc-black p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                      Comparación Salarial (Caja y Bigotes)
                    </h3>
                    <div className="h-[300px]">
                      {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={boxPlotData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#999" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`} />
                            <Tooltip 
                              cursor={{ fill: 'transparent' }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 text-xs space-y-1">
                                      <p className="font-bold mb-2">{data.name}</p>
                                      <p><span className="text-gray-400">Máx:</span> ${data.max.toLocaleString()}</p>
                                      <p><span className="text-gray-400">Q3:</span> ${data.q3.toLocaleString()}</p>
                                      <p><span className="text-gray-400">Mediana:</span> ${data.median.toLocaleString()}</p>
                                      <p><span className="text-gray-400">Q1:</span> ${data.q1.toLocaleString()}</p>
                                      <p><span className="text-gray-400">Mín:</span> ${data.min.toLocaleString()}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            {/* Transparent base to lift the box */}
                            <Bar dataKey="low" stackId="a" fill="transparent" />
                            {/* Lower whisker (simulated with a thin bar) */}
                            <Bar dataKey="q1_low" stackId="a" fill="#ddd" barSize={2} />
                            {/* Lower box */}
                            <Bar dataKey="median_q1" stackId="a" fill="#FFCC29" opacity={0.8} />
                            {/* Upper box */}
                            <Bar dataKey="q3_median" stackId="a" fill="#FFCC29" />
                            {/* Upper whisker */}
                            <Bar dataKey="high_q3" stackId="a" fill="#ddd" barSize={2} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <SlidersHorizontal size={48} className="opacity-20 mb-2" />
                          <p>Esperando datos salariales</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-uptc-black mb-8 flex items-center gap-2">
                      <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                      Distribución de Puntos
                    </h3>
                    <div className="h-[400px]">
                      {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={pointsDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="range" 
                              stroke="#999" 
                              fontSize={12} 
                              tickLine={false} 
                              axisLine={false}
                              label={{ value: 'puntos_actuales', position: 'bottom', fill: '#999', fontSize: 12, offset: 10 }}
                            />
                            <YAxis 
                              stroke="#999" 
                              fontSize={12} 
                              tickLine={false} 
                              axisLine={false}
                              label={{ value: 'count', angle: -90, position: 'insideLeft', fill: '#999', fontSize: 12 }}
                            />
                            <Tooltip 
                              cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            />
                            <Bar dataKey="count" fill="#FFCC29" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <LayoutDashboard size={48} className="opacity-20 mb-2" />
                          <p>Cargue datos para ver la distribución de puntos</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "simulador" && (
              <motion.div
                key="simulador"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-uptc-black tracking-tight">Simulador de Impacto Presupuestal</h2>
                    <p className="text-gray-500 mt-1 font-medium">Ajuste las variables para proyectar el esfuerzo fiscal requerido.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => exportToPDF(docenteSimRef, "Simulacion_Docente")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                      <FileDown size={16} />
                      PDF
                    </button>
                    <button 
                      onClick={() => exportToJPG(docenteSimRef, "Simulacion_Docente")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                      <Download size={16} />
                      JPG
                    </button>
                  </div>
                </div>

                <div ref={docenteSimRef} className="p-4 -m-4">
                  {/* KPI Cards for Simulator */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <KPICard title="Costo Actual Total" value={`$${(simImpact.actual / 1000000).toFixed(1)}M`} icon={FileText} label="BASE" />
                    <KPICard title="Costo Formalizado" value={`$${(simImpact.escenario_2027.formal / 1000000).toFixed(1)}M`} icon={FileText} color="uptc-black" label="OBJETIVO" />
                    <KPICard title="Docentes" value={simImpact.n} icon={LayoutDashboard} />
                    <KPICard title="% Aumento" value={`${simImpact.escenario_2027.inc.toFixed(2)}%`} icon={SlidersHorizontal} color="red-500" />
                    <KPICard title="Inversión Necesaria" value={`$${((simImpact.escenario_2027.formal - simImpact.actual) / 1000000).toFixed(1)}M`} icon={FileText} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white text-uptc-black p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <h4 className="font-bold text-uptc-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                          <span className="w-1 h-4 bg-uptc-yellow rounded-full"></span>
                          Parámetros de Simulación
                        </h4>
                        <div className="space-y-8">
                          <div>
                            <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Número de Docentes</label>
                            <div className="space-y-4">
                              <input 
                                type="range"
                                min="0"
                                max={2000}
                                value={parseInt(numDocentesInput) || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setSimPop(data.length > 0 ? (val / data.length) * 100 : 0);
                                }}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-uptc-yellow"
                              />
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    const current = parseInt(numDocentesInput) || 0;
                                    const next = Math.max(current - 1, 0);
                                    setSimPop(data.length > 0 ? (next / data.length) * 100 : 0);
                                  }}
                                  className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-uptc-black"
                                  title="Disminuir"
                                >
                                  <Minus size={18} />
                                </button>
                                <div className="relative flex-1">
                                  <input 
                                    type="number"
                                    min="0"
                                    max={2000}
                                    value={numDocentesInput}
                                    onChange={(e) => {
                                      const valStr = e.target.value;
                                      setNumDocentesInput(valStr);
                                      if (valStr === "") {
                                        setSimPop(0);
                                        return;
                                      }
                                      const val = parseInt(valStr);
                                      if (!isNaN(val)) {
                                        const clamped = Math.min(Math.max(val, 0), 2000);
                                        setSimPop(data.length > 0 ? (clamped / data.length) * 100 : 0);
                                      }
                                    }}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-black focus:ring-2 focus:ring-uptc-yellow outline-none"
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">/ 2000</span>
                                </div>
                                <button 
                                  onClick={() => {
                                    const current = parseInt(numDocentesInput) || 0;
                                    const next = Math.min(current + 1, 2000);
                                    setSimPop(data.length > 0 ? (next / data.length) * 100 : 0);
                                  }}
                                  className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors text-white"
                                  title="Aumentar"
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Presupuesto Disponible (Inversión)</label>
                            <div className="relative">
                              <input 
                                type="number"
                                placeholder="Ej: 5000000000"
                                value={budgetLimit}
                                onChange={(e) => {
                                  const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                                  setBudgetLimit(val);
                                  if (typeof val === "number" && val > 0) {
                                    calculateFromBudget(val);
                                  }
                                }}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-black focus:ring-2 focus:ring-uptc-yellow outline-none"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">COP</span>
                            </div>
                            {budgetLimit !== "" && budgetLimit > 0 && (
                              <p className="text-xs text-uptc-black font-bold mt-2">
                                Con este presupuesto se pueden formalizar {Math.ceil(data.length * (simPop / 100))} docentes.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-lg font-bold text-uptc-black flex items-center gap-2">
                            <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                            Costo actual Vs Costo Formalizado
                          </h3>
                          <div className="text-right">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Diferencia</div>
                            <div className="text-lg font-black text-green-600">
                              +${((simImpact.escenario_2027.formal - simImpact.actual) / 1000000).toFixed(1)}M
                            </div>
                            <div className="text-[10px] font-bold text-gray-400">
                              ({((simImpact.escenario_2027.formal / simImpact.actual - 1) * 100).toFixed(1)}% de aumento)
                            </div>
                          </div>
                        </div>
                        <div className="h-[300px]">
                          {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { name: 'Costo Actual', valor: simImpact.actual },
                                { name: 'Costo Formalizado', valor: simImpact.escenario_2027.formal }
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#999" fontSize={12} />
                                <YAxis hide />
                                <Tooltip 
                                  formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px' }}
                                />
                                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                                  <Cell fill="#1A1A1A" />
                                  <Cell fill="#FFCC29" />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <SlidersHorizontal size={48} className="opacity-20 mb-2" />
                              <p>Inicie la simulación cargando un archivo de datos base</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts section moved to end */}
                  {/* Simulated Comparison Table */}
                  <div className="bg-white text-uptc-black p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                      Comparación General de Escenarios (Simulado)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="text-gray-400 border-b border-gray-100">
                          <tr>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Escenario</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Escalafón</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Bonificación</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Catedráticos</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Diferencia</th>
                            <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Total Anual</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 font-bold">Actual</td>
                            <td className="px-4 py-4 text-gray-500">$0</td>
                            <td className="px-4 py-4 text-gray-500">$0</td>
                            <td className="px-4 py-4 text-gray-500">$0</td>
                            <td className="px-4 py-4 text-gray-500">$0</td>
                            <td className="px-4 py-4 text-uptc-black font-black">${simImpact.actual?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors bg-uptc-yellow/5">
                            <td className="px-4 py-4 font-bold text-uptc-black">Formalización</td>
                            <td className="px-4 py-4 text-gray-500">
                              ${simImpact.escenario_2027.costo_escalafon?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                            <td className="px-4 py-4 text-gray-500">${simImpact.escenario_2027.bonificacion.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-4 py-4 text-gray-500">${simImpact.escenario_2027.costo_catedraticos.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-4 py-4 text-gray-500 text-green-600 font-bold">+${(simImpact.escenario_2027.formal - simImpact.actual).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-4 py-4 text-uptc-black font-black">${simImpact.escenario_2027.formal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Charts section removed */}
                </div>
              </motion.div>
            )}

            {activeTab === "admin_resumen" && (
              <motion.div
                key="admin_resumen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-uptc-black tracking-tight">Dashboard Administrativo</h2>
                    <p className="text-gray-500 mt-1 font-medium">Análisis de nómina y costos anuales para personal administrativo.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-uptc-black border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <Download size={18} />
                      PDF
                    </button>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <KPICard title="Total Funcionarios" value={adminKpis.total} icon={Users} />
                  <KPICard title="Costo Mensual (Sueldos)" value={`$${(adminKpis.costo_mensual_total / 1000000).toFixed(1)}M`} icon={FileText} />
                  <KPICard title="Costo Anual Total (Carga Prestacional)" value={`$${(adminKpis.costo_anual_total / 1000000).toFixed(1)}M`} icon={TrendingUp} color="uptc-black" />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white text-uptc-black p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                      Funcionarios por Cargo
                    </h3>
                    <div className="h-[350px]">
                      {adminData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={adminCargoData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={150} fontSize={10} stroke="#999" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px' }}
                            />
                            <Bar dataKey="value" fill="#FFCC29" radius={[0, 4, 4, 0]} name="Cantidad" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <Users size={48} className="opacity-20 mb-2" />
                          <p>Cargue datos administrativos para visualizar</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white text-uptc-black p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                      Costo Anual por Cargo
                    </h3>
                    <div className="h-[350px]">
                      {adminData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={adminCargoData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={150} fontSize={10} stroke="#999" />
                            <Tooltip 
                              formatter={(value: number) => `$${value.toLocaleString()}`}
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px' }}
                            />
                            <Bar dataKey="cost" fill="#1A1A1A" radius={[0, 4, 4, 0]} name="Costo Anual" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <TrendingUp size={48} className="opacity-20 mb-2" />
                          <p>Cargue datos administrativos para visualizar</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Filtered Cargo Chart */}
                <div className="bg-white text-uptc-black p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                      Distribución de Cargos por Clasificación
                    </h3>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                      <SlidersHorizontal size={16} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-400 uppercase">Filtrar:</span>
                      <select 
                        value={adminFilterClasificacion}
                        onChange={(e) => setAdminFilterClasificacion(e.target.value)}
                        className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
                      >
                        {adminClassifications.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="h-[400px]">
                    {adminData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={adminFilteredCargoData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            interval={0} 
                            fontSize={10} 
                            height={80}
                            stroke="#999"
                          />
                          <YAxis fontSize={10} stroke="#999" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px' }}
                          />
                          <Bar dataKey="value" fill="#FFCC29" radius={[4, 4, 0, 0]} name="Número de Funcionarios">
                            {adminFilteredCargoData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#FFCC29" : "#1A1A1A"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Users size={48} className="opacity-20 mb-2" />
                        <p>Cargue datos administrativos para visualizar</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Classification Table */}
                <div className="bg-white text-uptc-black p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                    Resumen por Clasificación
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-gray-400 border-b border-gray-100">
                        <tr>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Tipo de Clasificación</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Número Total</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Valor Mensual (Sueldos)</th>
                          <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Valor Total Anual</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {adminClasificacionData.map((row, idx) => (
                          <tr key={`admin-class-row-${idx}`} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 font-bold">{row.name}</td>
                            <td className="px-4 py-4 text-gray-500">{row.count}</td>
                            <td className="px-4 py-4 text-gray-500">${row.monthly.toLocaleString()}</td>
                            <td className="px-4 py-4 text-uptc-black font-black">${row.total.toLocaleString()}</td>
                          </tr>
                        ))}
                        {adminClasificacionData.length > 0 && (
                          <tr className="bg-gray-50 font-black border-t-2 border-gray-100">
                            <td className="px-4 py-4">TOTAL GENERAL</td>
                            <td className="px-4 py-4">{adminKpis.total}</td>
                            <td className="px-4 py-4">${adminKpis.costo_mensual_total.toLocaleString()}</td>
                            <td className="px-4 py-4 text-uptc-black">${adminKpis.costo_anual_total.toLocaleString()}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Breakdown Section */}
                <div className="bg-white text-uptc-black p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-uptc-yellow rounded-full"></span>
                    Detalle de Cálculo Prestacional (Componentes del Costo Anual)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Sueldos Base (12 Meses)</p>
                      <p className="text-lg font-black">${(adminKpis.costo_mensual_total * 12).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Suma total de Columna 5 x 12</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Primas y Vacaciones</p>
                      <p className="text-lg font-black">${(adminKpis.total_primas + adminKpis.total_vacaciones).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Navidad, Servicios, Vacaciones</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Cesantías e Intereses</p>
                      <p className="text-lg font-black">${adminKpis.total_cesantias.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Ley 50 y complementarios</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Carga Patronal (Seg. Social + Parafiscales)</p>
                      <p className="text-lg font-black">${(adminKpis.total_seguridad_social + adminKpis.total_parafiscales).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Aportes patronales y parafiscales</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-uptc-black text-white rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-uptc-yellow uppercase tracking-widest">Costo Anual Total Estimado</p>
                      <p className="text-2xl font-black">${adminKpis.costo_anual_total.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-60">Factor Prestacional Promedio</p>
                      <p className="text-xl font-bold">~{adminKpis.costo_mensual_total > 0 ? ((adminKpis.costo_anual_total / (adminKpis.costo_mensual_total * 12) - 1) * 100).toFixed(1) : 0}%</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-uptc-yellow/5 border border-uptc-yellow/20 rounded-xl">
                    <p className="text-xs text-uptc-black/70 leading-relaxed">
                      <strong>Fórmula Aplicada:</strong> Costo Anual = (Sueldo × 12) + Prima Servicios (0.5) + Prima Navidad (1.0) + Prima Vacaciones (0.5) + Vacaciones (0.5) + Cesantías (1.0) + Intereses Cesantías (0.12) + Bonificación (0.35) + Seguridad Social (21% anual) + Parafiscales (9% anual).
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "admin_simulador" && (
              <motion.div
                key="admin_simulador"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-uptc-black tracking-tight">Simulador de Planta Administrativa</h2>
                    <p className="text-gray-500 mt-1 font-medium italic">Proyección de costos para nuevos cargos administrativos.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => exportToPDF(adminSimRef, "Simulacion_Administrativa")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                      <FileDown size={16} />
                      PDF
                    </button>
                    <button 
                      onClick={() => exportToJPG(adminSimRef, "Simulacion_Administrativa")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                      <Download size={16} />
                      JPG
                    </button>
                  </div>
                </div>

                <div ref={adminSimRef} className="p-4 -m-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-1 bg-uptc-black text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-uptc-yellow/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-uptc-yellow">
                      <SlidersHorizontal size={24} />
                      Configuración de Simulación
                    </h3>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Número de Cargos a Simular</label>
                        <input 
                          type="number" 
                          value={adminSimCount}
                          onChange={(e) => setAdminSimCount(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-2xl font-black text-uptc-yellow focus:ring-2 focus:ring-uptc-yellow outline-none transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Salario Mensual Promedio</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-white/30">$</span>
                          <input 
                            type="number" 
                            value={adminSimSalary}
                            onChange={(e) => setAdminSimSalary(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-2xl font-black text-uptc-yellow focus:ring-2 focus:ring-uptc-yellow outline-none transition-all"
                          />
                        </div>
                        <p className="text-[10px] text-white/30 mt-2 italic font-medium">Sueldo base mensual por cada funcionario.</p>
                      </div>

                      <div className="pt-6 border-t border-white/10">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-white/60">Costo Mensual Base</span>
                          <span className="text-xl font-black text-white">${adminSimResults.mensual_base.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-bold text-white/60">Costo Anual Base (12 Meses)</span>
                          <span className="text-xl font-black text-white">${adminSimResults.anual_base.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <KPICard 
                        title="Costo de la Inversión (Prestaciones + Carga)" 
                        value={`$${(adminSimResults.inversion / 1000000).toFixed(2)}M`} 
                        icon={TrendingUp} 
                        label="Anual"
                        color="uptc-black"
                      />
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-uptc-black">
                        <span className="w-1.5 h-8 bg-uptc-yellow rounded-full"></span>
                        Proyección de Crecimiento Salarial (2026 - 2027)
                      </h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { year: '2026 (Base)', costo: adminSimResults.gran_total },
                              { year: '2027 (+7%)', costo: adminSimResults.escenario_2027.gran_total },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="year" stroke="#666" fontSize={12} fontWeight="bold" />
                            <YAxis 
                              stroke="#666" 
                              fontSize={12} 
                              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                            />
                            <Tooltip 
                              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Costo Total']}
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="costo" 
                              name="Costo Total Anual"
                              stroke="#FFCC29" 
                              strokeWidth={4} 
                              dot={{ r: 6, fill: '#FFCC29', strokeWidth: 2, stroke: '#fff' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-uptc-black">
                        <span className="w-1.5 h-8 bg-uptc-yellow rounded-full"></span>
                        Comparativa de Escenarios (2026 vs 2027)
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <tr>
                              <th className="pb-4">Escenario</th>
                              <th className="pb-4 text-right">Sueldo Mensual</th>
                              <th className="pb-4 text-right">Costo Anual Base</th>
                              <th className="pb-4 text-right">Inversión (Prestaciones)</th>
                              <th className="pb-4 text-right">Gran Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            <tr className="hover:bg-gray-50 transition-colors">
                              <td className="py-4 font-bold">2026 (Parámetros)</td>
                              <td className="py-4 text-right text-gray-500">${adminSimSalary.toLocaleString()}</td>
                              <td className="py-4 text-right text-gray-500">${adminSimResults.anual_base.toLocaleString()}</td>
                              <td className="py-4 text-right text-gray-500">${adminSimResults.inversion.toLocaleString()}</td>
                              <td className="py-4 text-right font-black text-uptc-black">${adminSimResults.gran_total.toLocaleString()}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors bg-uptc-yellow/5">
                              <td className="py-4 font-bold text-uptc-black">2027 (Aumento 7%)</td>
                              <td className="py-4 text-right text-gray-500">${(adminSimSalary * AUMENTO_SALARIAL_2027).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="py-4 text-right text-gray-500">${adminSimResults.escenario_2027.anual_base.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="py-4 text-right text-gray-500">${adminSimResults.escenario_2027.inversion.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="py-4 text-right font-black text-uptc-black">${adminSimResults.escenario_2027.gran_total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-uptc-black">
                        <span className="w-1.5 h-8 bg-uptc-yellow rounded-full"></span>
                        Desglose de Costos Anuales (Simulación 2026)
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <tr>
                              <th className="pb-4">Concepto Prestacional</th>
                              <th className="pb-4 text-center">Factor / Base</th>
                              <th className="pb-4 text-right">Valor Anual Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Prima de Servicios</td>
                              <td className="py-4 text-center text-gray-500">0.5 Sueldos</td>
                              <td className="py-4 text-right font-medium">${adminSimResults.prima_servicios.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Prima de Navidad</td>
                              <td className="py-4 text-center text-gray-500">1.0 Sueldos</td>
                              <td className="py-4 text-right font-medium">${adminSimResults.prima_navidad.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Primas y Vacaciones</td>
                              <td className="py-4 text-center text-gray-500">1.0 Sueldos</td>
                              <td className="py-4 text-right font-medium">${(adminSimResults.prima_vacaciones + adminSimResults.vacaciones).toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Cesantías e Intereses</td>
                              <td className="py-4 text-center text-gray-500">1.12 Sueldos</td>
                              <td className="py-4 text-right font-medium">${(adminSimResults.cesantias + adminSimResults.intereses_cesantias).toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Bonificación por Servicios</td>
                              <td className="py-4 text-center text-gray-500">0.35 Sueldos</td>
                              <td className="py-4 text-right font-medium">${adminSimResults.bonificacion.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Seguridad Social (Patronal)</td>
                              <td className="py-4 text-center text-gray-500">21% Anual</td>
                              <td className="py-4 text-right font-medium">${adminSimResults.seguridad_social.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Parafiscales</td>
                              <td className="py-4 text-center text-gray-500">9% Anual</td>
                              <td className="py-4 text-right font-medium">${adminSimResults.parafiscales.toLocaleString()}</td>
                            </tr>
                            <tr className="bg-uptc-yellow/10 font-black">
                              <td className="py-4 px-4 rounded-l-xl">COSTO TOTAL ANUAL ESTIMADO</td>
                              <td className="py-4 text-center">Global</td>
                              <td className="py-4 px-4 text-right rounded-r-xl text-lg">${adminSimResults.gran_total.toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

            {activeTab === "cps_resumen" && (
              <motion.div
                key="cps_resumen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-uptc-black tracking-tight">Resumen CPS</h2>
                    <p className="text-gray-500 mt-1 font-medium italic">Análisis de Contratos de Prestación de Servicios.</p>
                  </div>
                  <div className="flex items-center gap-3">
                  </div>
                </div>

                {cpsData.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <KPICard title="Total Contratos" value={cpsKpis.total} icon={Users} />
                      <KPICard title="Valor Total Contratos" value={`$${(cpsKpis.valor_total_contratos / 1000000).toFixed(2)}M`} icon={TrendingUp} />
                      <KPICard title="Costo Formalizado" value={`$${(cpsKpis.costo_anual_formalizado / 1000000).toFixed(2)}M`} icon={ShieldCheck} color="uptc-black" />
                      <KPICard title="Inversión Necesaria" value={`$${(cpsKpis.inversion_total / 1000000).toFixed(2)}M`} icon={TrendingUp} color="uptc-yellow" />
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                      <div className="flex flex-wrap gap-4 items-center mb-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Recurso:</span>
                          <select 
                            value={cpsFilterRecurso}
                            onChange={(e) => setCpsFilterRecurso(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:ring-2 focus:ring-uptc-yellow"
                          >
                            {cpsFilterOptions.recursos.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Nivel:</span>
                          <select 
                            value={cpsFilterNivel}
                            onChange={(e) => setCpsFilterNivel(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:ring-2 focus:ring-uptc-yellow"
                          >
                            {cpsFilterOptions.niveles.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Tipo Función:</span>
                          <select 
                            value={cpsFilterTipo}
                            onChange={(e) => setCpsFilterTipo(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:ring-2 focus:ring-uptc-yellow"
                          >
                            {cpsFilterOptions.tipos.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="h-80">
                          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Distribución por Recurso</h4>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={cpsChartData.recurso}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {cpsChartData.recurso.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={["#FFCC29", "#1A1A1A", "#4B5563", "#9CA3AF"][index % 4]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="h-80">
                          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Distribución por Nivel</h4>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cpsChartData.nivel}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                              <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                              <Bar dataKey="value" fill="#FFCC29" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="h-80">
                          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Distribución por Tipo Función</h4>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cpsChartData.tipo} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                              <XAxis type="number" axisLine={false} tickLine={false} hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} width={80} />
                              <Tooltip cursor={{ fill: '#f9fafb' }} />
                              <Bar dataKey="value" fill="#1A1A1A" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-uptc-black">
                        <span className="w-1.5 h-8 bg-uptc-yellow rounded-full"></span>
                        Resumen por Centro de Costo
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-400 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Centro de Costo</th>
                              <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-center">Misional</th>
                              <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-center">Apoyo</th>
                              <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-center">Convenio</th>
                              <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Distribución Niveles</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Object.entries(cpsSummaryTable).map(([cc, data]: [string, any]) => (
                              <tr key={cc} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-uptc-black">{cc}</td>
                                <td className="px-6 py-4 text-center font-medium">{data.misional}</td>
                                <td className="px-6 py-4 text-center font-medium">{data.apoyo}</td>
                                <td className="px-6 py-4 text-center font-medium">{data.convenio}</td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-2">
                                    {Object.entries(data.niveles).map(([nivel, count]: [string, any]) => (
                                      <span key={nivel} className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded-md">
                                        {nivel}: {count}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <Upload className="text-gray-300" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-uptc-black mb-2">No hay datos de CPS</h3>
                    <p className="text-gray-400 max-w-md font-medium">Cargue un archivo CSV con la información de los contratistas para comenzar el análisis.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "cps_simulador" && (
              <motion.div
                key="cps_simulador"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-uptc-black tracking-tight">Simulador de Formalización CPS</h2>
                    <p className="text-gray-500 mt-1 font-medium italic">Proyección de costos para formalizar contratistas CPS a planta (Simulación Independiente).</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => exportToPDF(cpsSimRef, "Simulacion_CPS")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                      <FileDown size={16} />
                      PDF
                    </button>
                    <button 
                      onClick={() => exportToJPG(cpsSimRef, "Simulacion_CPS")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                      <Download size={16} />
                      JPG
                    </button>
                  </div>
                </div>

                <div ref={cpsSimRef} className="p-4 -m-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-3">Número de PROFESIONALES</label>
                      <div className="relative">
                        <input 
                          type="number"
                          min="0"
                          value={cpsSimProfCount}
                          onChange={(e) => setCpsSimProfCount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-xl font-black focus:ring-2 focus:ring-uptc-yellow outline-none transition-all"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$3.6M/mes</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-3">Número de TÉCNICOS</label>
                      <div className="relative">
                        <input 
                          type="number"
                          min="0"
                          value={cpsSimTecCount}
                          onChange={(e) => setCpsSimTecCount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-xl font-black focus:ring-2 focus:ring-uptc-yellow outline-none transition-all"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$2.5M/mes</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-3">Número de ASISTENCIALES</label>
                      <div className="relative">
                        <input 
                          type="number"
                          min="0"
                          value={cpsSimAsisCount}
                          onChange={(e) => setCpsSimAsisCount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-xl font-black focus:ring-2 focus:ring-uptc-yellow outline-none transition-all"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$2.2M/mes</span>
                      </div>
                    </div>
                  </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="lg:col-span-1 bg-uptc-black text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-uptc-yellow/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-uptc-yellow">
                      <SlidersHorizontal size={24} />
                      Resumen Simulación
                    </h3>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Total Contratos a Formalizar</label>
                        <p className="text-4xl font-black text-uptc-yellow">{cpsIndependentSim.total}</p>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Inversión Necesaria</label>
                        <p className="text-4xl font-black text-white">${(cpsIndependentSim.inversion_total / 1000000).toFixed(2)}M</p>
                        <p className="text-[10px] text-white/30 mt-2 italic font-medium">Costo adicional para formalizar este grupo.</p>
                      </div>

                      <div className="pt-6 border-t border-white/10">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-white/60">Costo Actual (11 meses)</span>
                          <span className="text-xl font-black text-white">${(cpsIndependentSim.valor_total_contratos / 1000000).toFixed(2)}M</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-bold text-white/60">Costo Planta Formalizado</span>
                          <span className="text-xl font-black text-white">${(cpsIndependentSim.costo_anual_formalizado / 1000000).toFixed(2)}M</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-uptc-black">
                        <span className="w-1.5 h-8 bg-uptc-yellow rounded-full"></span>
                        Comparativa de Escenarios (2026 vs 2027)
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <tr>
                              <th className="pb-4">Escenario</th>
                              <th className="pb-4 text-right">Costo Mensual Base</th>
                              <th className="pb-4 text-right">Costo Anual Base</th>
                              <th className="pb-4 text-right">Inversión (Prestaciones)</th>
                              <th className="pb-4 text-right">Gran Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            <tr className="hover:bg-gray-50 transition-colors">
                              <td className="py-4 font-bold">2026 (Parámetros)</td>
                              <td className="py-4 text-right text-gray-500">${cpsIndependentSim.mensual_base.toLocaleString()}</td>
                              <td className="py-4 text-right text-gray-500">${cpsIndependentSim.anual_base.toLocaleString()}</td>
                              <td className="py-4 text-right text-gray-500">${(cpsIndependentSim.costo_anual_formalizado - cpsIndependentSim.anual_base).toLocaleString()}</td>
                              <td className="py-4 text-right font-black text-uptc-black">${cpsIndependentSim.costo_anual_formalizado.toLocaleString()}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors bg-uptc-yellow/5">
                              <td className="py-4 font-bold text-uptc-black">2027 (Aumento 7%)</td>
                              <td className="py-4 text-right text-gray-500">${cpsIndependentSim.escenario_2027.mensual_base.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="py-4 text-right text-gray-500">${cpsIndependentSim.escenario_2027.anual_base.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="py-4 text-right text-gray-500">${(cpsIndependentSim.escenario_2027.costo_anual_formalizado - cpsIndependentSim.escenario_2027.anual_base).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="py-4 text-right font-black text-uptc-black">${cpsIndependentSim.escenario_2027.costo_anual_formalizado.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-uptc-black">
                        <span className="w-1.5 h-8 bg-uptc-yellow rounded-full"></span>
                        Desglose de Costos Anuales (Simulación 2026)
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <tr>
                              <th className="pb-4">Concepto Prestacional</th>
                              <th className="pb-4 text-right">Valor Anual Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Prima de Servicios / Navidad / Vacaciones</td>
                              <td className="py-4 text-right font-medium">${cpsIndependentSim.total_primas.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Cesantías e Intereses</td>
                              <td className="py-4 text-right font-medium">${cpsIndependentSim.total_cesantias.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Vacaciones e Incapacidades</td>
                              <td className="py-4 text-right font-medium">${cpsIndependentSim.total_vacaciones.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Bonificación por Servicios</td>
                              <td className="py-4 text-right font-medium">${cpsIndependentSim.total_bonificaciones.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Seguridad Social (Patronal)</td>
                              <td className="py-4 text-right font-medium">${cpsIndependentSim.total_seguridad_social.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-4 font-bold text-uptc-black">Parafiscales</td>
                              <td className="py-4 text-right font-medium">${cpsIndependentSim.total_parafiscales.toLocaleString()}</td>
                            </tr>
                            <tr className="bg-uptc-yellow/10 font-black">
                              <td className="py-4 px-4 rounded-l-xl">INVERSIÓN NECESARIA TOTAL</td>
                              <td className="py-4 px-4 text-right rounded-r-xl text-lg">${cpsIndependentSim.inversion_total.toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

            {activeTab === "cps_reporte" && (
              <motion.div
                key="cps_reporte"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-uptc-black tracking-tight">Reporte CPS</h2>
                    <p className="text-gray-500 mt-1 font-medium">Detalle individual de costos anuales para contratistas CPS.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (cpsData.length === 0) return;
                      const headers = "NOMBRE;RECURSO;NIVEL;TIPO_FUNCION;CENTRO_COSTO;CONTRATOS;VALOR_CONTRATO;SALARIO_MENSUAL;COSTO_ANUAL_PLANTA;INVERSION_NECESARIA\n";
                      const rows = cpsData.map(d => `${d.nombre};${d.recurso};${d.nivel};${d.tipo_funcion};${d.centro_costo};${d.contratos};${d.valor_total_contrato};${d.salario_mensual};${d.costo_anual_total};${d.inversion_necesaria}`).join("\n");
                      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute("download", "reporte-cps-uptc.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-uptc-black text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all shadow-md"
                  >
                    <Download size={18} />
                    Descargar CSV CPS
                  </button>
                </div>

                <div className="bg-white text-uptc-black rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-400 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Nombre</th>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Recurso</th>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Nivel</th>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Función</th>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-right">Contrato</th>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-right">Inversión</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {cpsData.slice(0, 50).map((d, i) => (
                          <tr key={`cps-row-${i}`} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold">{d.nombre}</td>
                            <td className="px-6 py-4 text-xs font-medium">{d.recurso}</td>
                            <td className="px-6 py-4 text-xs font-medium">{d.nivel}</td>
                            <td className="px-6 py-4 text-xs font-medium">{d.tipo_funcion}</td>
                            <td className="px-6 py-4 text-right font-mono">${d.valor_total_contrato.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right font-mono text-uptc-yellow font-bold">${d.inversion_necesaria.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {cpsData.length > 50 && (
                      <div className="p-4 text-center text-xs text-gray-400 font-medium bg-gray-50">
                        Mostrando los primeros 50 registros de {cpsData.length}. Descargue el CSV para el detalle completo.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "admin_reporte" && (
              <motion.div
                key="admin_reporte"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-uptc-black tracking-tight">Reporte Administrativos</h2>
                    <p className="text-gray-500 mt-1 font-medium">Detalle individual de costos anuales por funcionario.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (adminData.length === 0) return;
                      const headers = "NOMBRE;NUMDOC;CARGO;CARGOBASE;SUELDO;CLASIFICACION;COSTO_ANUAL_TOTAL\n";
                      const rows = adminData.map(d => `${d.nombre};${d.numdoc};${d.cargo};${d.cargobase};${d.sueldo};${d.clasificacion};${d.costo_anual_total}`).join("\n");
                      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute("download", "reporte-administrativos-uptc.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-uptc-black text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all shadow-md"
                  >
                    <Download size={18} />
                    Descargar CSV
                  </button>
                </div>

                <div className="bg-white text-uptc-black rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-400 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Nombre</th>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Documento</th>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Cargo</th>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Clasificación</th>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Sueldo Mensual</th>
                          <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Costo Anual Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {adminData.map((row, idx) => (
                          <tr key={`admin-row-${idx}`} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-uptc-black">{row.nombre}</td>
                            <td className="px-6 py-4 text-gray-500">{row.numdoc}</td>
                            <td className="px-6 py-4 text-gray-500">{row.cargo}</td>
                            <td className="px-6 py-4 text-gray-500">{row.clasificacion}</td>
                            <td className="px-6 py-4 text-gray-500">${row.sueldo.toLocaleString()}</td>
                            <td className="px-6 py-4 font-black text-uptc-black">${row.costo_anual_total.toLocaleString()}</td>
                          </tr>
                        ))}
                        {adminData.length > 0 && (
                          <tr className="bg-gray-50 font-black border-t-2 border-gray-100">
                            <td colSpan={4} className="px-6 py-4 text-right uppercase tracking-widest text-[10px]">Totales Generales</td>
                            <td className="px-6 py-4">${adminKpis.costo_mensual_total.toLocaleString()}</td>
                            <td className="px-6 py-4 text-uptc-black font-black">${adminKpis.costo_anual_total.toLocaleString()}</td>
                          </tr>
                        )}
                        {adminData.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No hay datos cargados. Cargue un archivo CSV en el apartado de Resumen.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "modelo_tecnico" && (
              <motion.div
                key="modelo_tecnico"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto"
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-uptc-black tracking-tight">Reporte Técnico</h2>
                    <p className="text-gray-500 mt-1 font-medium italic">Documentación detallada del modelo matemático.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => exportToPDF(modeloTecnicoRef, "Reporte_Tecnico_Modelo")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                      <FileDown size={16} />
                      PDF
                    </button>
                    <button 
                      onClick={() => exportToJPG(modeloTecnicoRef, "Reporte_Tecnico_Modelo")}
                      className="flex items-center gap-2 px-4 py-2 bg-uptc-black text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                      <LayoutDashboard size={16} />
                      JPG
                    </button>
                  </div>
                </div>

                <div ref={modeloTecnicoRef} className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-12 border-b border-gray-100 pb-8">
                    <div className="w-16 h-16 bg-uptc-black rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="text-uptc-yellow" size={32} />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-uptc-black tracking-tight uppercase">Descripción Técnica y Formulación Matemática</h2>
                      <p className="text-gray-500 font-medium">Análisis microeconómico individual agregado y lógica institucional.</p>
                    </div>
                  </div>

                  <div className="space-y-12 text-gray-700 leading-relaxed text-justify">
                    <section>
                      <p className="text-lg">
                        El modelo de simulación financiera para la formalización docente de la Universidad Pedagógica y Tecnológica de Colombia (UPTC) se fundamenta en un enfoque de 
                        <span className="font-bold text-uptc-black"> estimación microeconómica individual agregada</span>, en el cual el costo total institucional se obtiene a partir del cálculo del costo anual por docente bajo dos escenarios: actual y formalizado.
                      </p>
                    </section>

                    <section className="space-y-6">
                      <h3 className="text-2xl font-black text-uptc-black flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-uptc-yellow rounded-full"></span>
                        1. Estructura de Puntos y Escalafón
                      </h3>
                      <p>Para cada docente <span className="italic font-serif">i</span>, se define inicialmente su estructura de puntos como:</p>
                      <div className="bg-gray-50 p-8 rounded-2xl font-mono text-xl text-center text-uptc-black border border-gray-100">
                        P_i = E_i + X_i + A_i
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                          <span className="font-bold text-uptc-black">E_i:</span> Puntos por estudios universitarios.
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                          <span className="font-bold text-uptc-black">X_i:</span> Puntos por experiencia calificada.
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                          <span className="font-bold text-uptc-black">A_i:</span> Puntos por productividad académica.
                        </div>
                      </div>
                      <p>En el escenario de formalización, se incorpora un incremento fijo en el escalafón docente:</p>
                      <div className="bg-gray-50 p-8 rounded-2xl font-mono text-xl text-center text-uptc-black border border-gray-100">
                        P_i^f = P_i + Δ
                      </div>
                      <p className="text-sm">Donde <span className="font-bold text-uptc-black">Δ = 72</span> representa los puntos adicionales de formalización.</p>
                    </section>

                    <section className="space-y-6">
                      <h3 className="text-2xl font-black text-uptc-black flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-uptc-yellow rounded-full"></span>
                        2. Cálculo del Salario
                      </h3>
                      <p>El salario mensual de cada docente se determina como:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-6 rounded-2xl font-mono text-center border border-gray-100">
                          S_i = P_i × V_p
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl font-mono text-center border border-gray-100">
                          S_i^f = P_i^f × V_p
                        </div>
                      </div>
                      <p className="text-sm">
                        Donde <span className="font-bold text-uptc-black">V_p = $23.923</span> es el valor del punto salarial vigente (2026).
                      </p>
                    </section>

                    <section className="space-y-6">
                      <h3 className="text-2xl font-black text-uptc-black flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-uptc-yellow rounded-full"></span>
                        3. Cálculo del Costo Anual y Prestaciones
                      </h3>
                      <p>El costo anual incorpora salario y prestaciones sociales. Se define como:</p>
                      <div className="bg-gray-50 p-8 rounded-2xl font-mono text-lg text-center text-uptc-black border border-gray-100 space-y-4">
                        <div>C_i = 12 ⋅ S_i + Σ_{"k=1"}^n (α_k ⋅ 12 ⋅ S_i)</div>
                        <div>C_i^f = 12 ⋅ S_i^f + Σ_{"k=1"}^n (α_k ⋅ 12 ⋅ S_i^f)</div>
                      </div>
                      <p className="text-sm">
                        Donde <span className="italic font-serif">α_k</span> representa los coeficientes de prestaciones sociales (Vacaciones, Primas, Cesantías, Pensión, etc.), derivados de la normatividad vigente.
                      </p>
                    </section>

                    <section className="space-y-6">
                      <h3 className="text-2xl font-black text-uptc-black flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-uptc-yellow rounded-full"></span>
                        4. Incorporación de Bonificación y Catedráticos
                      </h3>
                      <p>En el escenario de formalización, se incluye una bonificación adicional equivalente a un porcentaje del salario mensual:</p>
                      <div className="bg-gray-50 p-8 rounded-2xl font-mono text-xl text-center text-uptc-black border border-gray-100">
                        B_i = β ⋅ S_i^f
                      </div>
                      <p className="text-sm">Donde <span className="font-bold text-uptc-black">β = 0.35</span>. El costo total formalizado es entonces:</p>
                      <div className="bg-gray-50 p-6 rounded-2xl font-mono text-center border border-gray-100">
                        CT_i^f = C_i^f + B_i
                      </div>

                      <p className="mt-8">Para la simulación poblacional, el costo de catedráticos se estima mediante la función:</p>
                      <div className="bg-gray-50 p-8 rounded-2xl font-mono text-lg text-center text-uptc-black border border-gray-100">
                        C_cat = (⌊N_sim / 2⌋ ⋅ K_2) + ((N_sim mod 2) ⋅ K_1)
                      </div>
                      <p className="text-sm italic">
                        Donde <span className="font-bold">K_1</span> y <span className="font-bold">K_2</span> son constantes de costo base para niveles de cátedra, y <span className="font-bold">N_sim</span> es el tamaño de la muestra.
                      </p>
                    </section>

                    <section className="space-y-6">
                      <h3 className="text-2xl font-black text-uptc-black flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-uptc-yellow rounded-full"></span>
                        5. Agregación e Impacto Presupuestal
                      </h3>
                      <p>El costo total institucional se obtiene mediante la suma de todos los docentes:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-6 rounded-2xl font-mono text-center border border-gray-100">
                          CT = Σ_{"i=1"}^N C_i
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl font-mono text-center border border-gray-100">
                          CT^f = Σ_{"i=1"}^N CT_i^f
                        </div>
                      </div>

                      <p>La inversión requerida (<span className="font-bold italic">I</span>) y el incremento porcentual (<span className="font-bold italic">%Δ</span>) se definen como:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-6 rounded-2xl font-mono text-center border border-gray-100">
                          I = CT^f - CT
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl font-mono text-center border border-gray-100">
                          %Δ = (I / CT) × 100
                        </div>
                      </div>

                      <p>El modelo permite aislar el efecto del escalafón (incremento estructural) mediante:</p>
                      <div className="bg-gray-50 p-8 rounded-2xl font-mono text-lg text-center text-uptc-black border border-gray-100">
                        Escalafón = CT^f - Σ B_i - CT
                      </div>
                    </section>

                    <section className="space-y-6">
                      <h3 className="text-2xl font-black text-uptc-black flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-uptc-yellow rounded-full"></span>
                        6. Procedimiento de Cálculo
                      </h3>
                      <div className="space-y-4">
                        {[
                          { step: "1", title: "Carga y depuración de datos", desc: "Se importan los datos desde un archivo CSV, se normalizan los formatos numéricos y se corrigen valores inconsistentes." },
                          { step: "2", title: "Construcción de variables base", desc: "Se calculan los puntos totales por docente sumando estudios, experiencia y productividad." },
                          { step: "3", title: "Simulación de escenarios", desc: "Se generan dos escenarios: Actual (sin modificación) y Formalizado (con incremento de 72 puntos)." },
                          { step: "4", title: "Cálculo económico", desc: "Para cada docente se estiman: Salario mensual, Salario anual, Prestaciones sociales y Bonificación." },
                          { step: "5", title: "Agregación y análisis", desc: "Se suman los costos individuales para obtener el costo total actual, formalizado e inversión." }
                        ].map((item) => (
                          <div key={item.step} className="flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 bg-uptc-black text-uptc-yellow rounded-xl flex items-center justify-center font-black flex-shrink-0">
                              {item.step}
                            </div>
                            <div>
                              <p className="font-bold text-uptc-black uppercase text-xs tracking-wider mb-1">{item.title}</p>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="pt-8 border-t border-gray-100">
                      <h3 className="text-xl font-black text-uptc-black mb-4 uppercase tracking-tight">Conclusión Técnica</h3>
                      <p className="italic text-gray-600">
                        El modelo combina una estructura determinística basada en reglas normativas con una lógica de agregación financiera, permitiendo estimar de manera precisa el impacto presupuestal de la formalización docente, descomponer sus componentes y facilitar la toma de decisiones estratégicas a nivel institucional.
                      </p>
                    </section>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "reporte" && (
              <motion.div
                key="reporte"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-uptc-black tracking-tight">Reporte de Docentes</h2>
                    <p className="text-gray-500 mt-1 font-medium">Listado detallado de la simulación de formalización uno a uno.</p>
                  </div>
                  <button 
                    onClick={handleDownloadCSVReport}
                    className="flex items-center gap-2 px-5 py-2.5 bg-uptc-black text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all shadow-md"
                  >
                    <Download size={18} />
                    Descargar CSV
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4">Nombre del Docente</th>
                          <th className="px-6 py-4">Categoría</th>
                          <th className="px-6 py-4 text-center">Puntos Actuales</th>
                          <th className="px-6 py-4 text-right">Salario Actual</th>
                          <th className="px-6 py-4 text-right">Salario Formalizado</th>
                          <th className="px-6 py-4 text-right">Costo Total Formalizado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {data.map((d) => (
                          <tr key={d.id} className="hover:bg-gray-50 transition-colors text-xs">
                            <td className="px-6 py-4 font-bold text-uptc-black uppercase">{d.nombre}</td>
                            <td className="px-6 py-4 text-gray-500">{d.categoria}</td>
                            <td className="px-6 py-4 text-center font-medium">{d.puntos_actuales.toFixed(1)}</td>
                            <td className="px-6 py-4 text-right text-gray-500">${d.salario_actual.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-6 py-4 text-right text-gray-600 font-semibold">${d.salario_formalizado.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-6 py-4 text-right font-black text-uptc-black">${d.costo_formalizado_total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          </tr>
                        ))}
                        {data.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                              No hay datos cargados para generar el reporte.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "costo_formalizacion" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div>
                    <h2 className="text-xl font-black text-uptc-black uppercase">Exportar Proyección</h2>
                    <p className="text-sm text-gray-500">Descargue los resultados de la proyección de costos de formalización.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => exportToPDF(costoFormalizacionRef, "Proyeccion_Costos_Formalizacion")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                      <FileDown size={16} />
                      PDF
                    </button>
                    <button 
                      onClick={() => exportToJPG(costoFormalizacionRef, "Proyeccion_Costos_Formalizacion")}
                      className="flex items-center gap-2 px-4 py-2 bg-uptc-black text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                      <LayoutDashboard size={16} />
                      JPG
                    </button>
                  </div>
                </div>
                <div ref={costoFormalizacionRef}>
                  <CostoFormalizacionPage 
                    summary={formalizationSummary}
                    countDoc1={countDoc1} setCountDoc1={setCountDoc1}
                    countCPSProf1={countCPSProf1} setCountCPSProf1={setCountCPSProf1}
                    countCPSTec1={countCPSTec1} setCountCPSTec1={setCountCPSTec1}
                    countCPSAsis1={countCPSAsis1} setCountCPSAsis1={setCountCPSAsis1}
                    countDoc2={countDoc2} setCountDoc2={setCountDoc2}
                    countCPSProf2={countCPSProf2} setCountCPSProf2={setCountCPSProf2}
                    countCPSTec2={countCPSTec2} setCountCPSTec2={setCountCPSTec2}
                    countCPSAsis2={countCPSAsis2} setCountCPSAsis2={setCountCPSAsis2}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-12 py-8 border-t border-gray-200 text-center md:hidden">
            <p className="text-[10px] text-gray-400 font-medium px-4">
              ©Fabián L. Cely – VAFI – Universidad Pedagógica y Tecnológica de Colombia
            </p>
          </footer>
        </div>
      </main>

      {/* Chatbot Toggle */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-uptc-black text-uptc-yellow rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200"
          >
            <div className="bg-uptc-black p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-uptc-yellow" />
                <span className="font-bold">Centavito</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:text-uptc-yellow transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatMessages.map((msg, i) => (
                <div key={`chat-msg-${i}`} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                    msg.role === "user" ? "bg-uptc-black text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Escribe tu pregunta..." 
                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-uptc-yellow"
              />
              <button 
                onClick={handleSendMessage}
                className="w-10 h-10 bg-uptc-yellow text-uptc-black rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
