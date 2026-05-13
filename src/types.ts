export interface TeacherData {
  id: string;
  nombre: string;
  tipo_vinculacion: string;
  tipo_ingreso: string;
  puntos_estudios: number;
  puntos_experiencia: number;
  puntos_productividad: number;
  puntos_actuales: number;
  puntos_formalizados: number;
  salario_actual: number;
  salario_formalizado: number;
  costo_actual: number;
  costo_formalizado: number;
  bonificacion: number;
  costo_formalizado_total: number;
  categoria: string;
}

export interface AdminData {
  nombre: string;
  numdoc: string;
  cargo: string;
  cargobase: string;
  sueldo: number;
  clasificacion: string;
  // Calculated fields
  prima_servicios: number;
  prima_navidad: number;
  prima_vacaciones: number;
  vacaciones: number;
  cesantias: number;
  intereses_cesantias: number;
  bonificacion_servicios: number;
  seguridad_social: number;
  parafiscales: number;
  costo_anual_total: number;
}

export interface CPSData {
  nombre: string;
  recurso: string;
  nivel: string;
  tipo_funcion: string; // MISIONAL, APOYO, CONVENIO
  centro_costo: string;
  contratos: string;
  valor_total_contrato: number;
  salario_mensual: number;
  // Calculated fields for simulation
  prima_servicios: number;
  prima_navidad: number;
  prima_vacaciones: number;
  vacaciones: number;
  cesantias: number;
  intereses_cesantias: number;
  bonificacion_servicios: number;
  seguridad_social: number;
  parafiscales: number;
  costo_anual_total: number;
  inversion_necesaria: number;
}

export type TabType = 
  | "landing" 
  | "resumen" 
  | "simulador" 
  | "reporte" 
  | "admin_resumen" 
  | "admin_simulador" 
  | "admin_reporte"
  | "cps_resumen"
  | "cps_simulador"
  | "cps_reporte"
  | "modelo_tecnico"
  | "costo_formalizacion";
