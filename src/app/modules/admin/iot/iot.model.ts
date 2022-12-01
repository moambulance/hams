export interface MedtelData {
  access_token: string;
  thp_id: string;
  patient_name: string;
  mobile: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
}
export interface patientData {
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: number;
  suffering_from_id: number;
  need_assistance?: number;
  financial_support?: number;
  financial_type?: number;
  financial_amount?: number;
  adhar_front_image?: string;
  adhar_back_image?: string;
  pancard_image?: string;
  patient_report?: string;
  order_id?: number;
  preExistingDisease?: string;
  p_address?: string;
  height?: number;
  weight?: number;
  patient_unique_id?: string;
  is_active: number;
}
export interface Medtel {
  access_token: string;
  thp_id: string;
  patient_id: number;
  patient_unique_id: string;
}

export interface StethoPath {
  position: string;
  path: string;
}
export interface PocResult {
  ba_weight: string;
  ba_bmi: string;
  ba_body_fat: string;
  ba_fat_free_body_weight: string;
  ba_subcutaneous_fat: string;
  ba_visceral_fat: string;
  ba_body_water: string;
  ba_skeletal_muscle: string;
  ba_muscle_mass: string;
  ba_bone_mass: string;
  ba_protein: string;
  ba_bmr: string;
  ba_bsa: string;
  thermometer: string;
  thermometer_unit: string;
  spo2: string;
  spo2_pulse: string;
  spo2_pi: string;
  bp: string;
  pulse: string;
  stethoscope_type: string;
  stetho_path: StethoPath[];
  otoscope_path: string[];
  glucose: string;
  glucoseCategory: string;
  hemoglobin: string;
  hba1c: string;
  malaria: string;
  pregnancy: string;
  url: string;
  triglycerides: string;
  total_cholesterol: string;
  hdl_cholesterol: string;
  ldl: string;
  vldl: string;
  tc_hdl_ratio: string;
}
export interface ScreeningDetail {
  pocType: string;
  pocResult: PocResult;
}
export interface RootObject {
  medteluniqueid: string;
  thp_id: string;
  thp_name: string;
  name: string;
  mobile: string;
  gender: string;
  age: string;
  screening_date: string;
  screening_time: string;
  screening_details: ScreeningDetail[];
  patient_uniqueid: string;
  report_url: string;
}
export interface medtelResponseData {
  medteluniqueid: string;
  thp_id: string;
  thp_name: string;
  name: string;
  mobile: string;
  gender: string;
  age: string;
  screening_date: string;
  screening_time: string;
  patient_uniqueid: string;
  report_url: string;
  screening_details: string;
}
export interface SaveMedtelOrder {
  patient_id: number;
  company_id: number;

  test_ids: string;

  status: number;

  razor_pay_details: string;
}
