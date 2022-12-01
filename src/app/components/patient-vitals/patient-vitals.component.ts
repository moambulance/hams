import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-patient-vitals',
  templateUrl: './patient-vitals.component.html',
  styleUrls: ['./patient-vitals.component.css']
})
export class PatientVitalsComponent implements OnInit {
  @Output() closeClick = new EventEmitter();

  medtelIotDetails: Array<any> = [];
  patientVitals: any = {};
  currentPatientVitalIndex: number = 0;
  reportUrl: string = "";

  constructor() { }

  ngOnInit(): void {
    // console.log("Init patient vitals component");
  }

  onParentEventReceived(data: any) {
    // console.log("called from parent ", data);
    this.medtelIotDetails = data.map((response: any, index: any) => {
        const bp = response.screening_details.filter((item: any) => item.pocType === 'Vitals_BP')[0];
        const spo2 = response.screening_details.filter((item: any) => item.pocType === 'SpO2')[0];
        return {
          ...response,
          bp: (bp?.pocResult) ? bp?.pocResult.bp : '-',
          pr: (bp?.pocResult) ? bp?.pocResult.pulse : '-',
          spo2: (spo2?.pocResult) ? spo2?.pocResult.spo2 : '-'
        };
      },
    );
    // console.log('this.medtelIotDetails ', this.medtelIotDetails);
    this.updatePatientVitalData();
  }

  onScreeningTimeClick(index: number) {
    this.currentPatientVitalIndex = index;
    this.updatePatientVitalData();
  }

  updatePatientVitalData() {
    // console.log("updatePatientVitalData");
    const screeningDetails = this.medtelIotDetails[this.currentPatientVitalIndex].screening_details;
    this.reportUrl = this.medtelIotDetails[this.currentPatientVitalIndex].report_url;
    const displayItems = ['SpO2', 'Vitals_BP', 'Thermometer', 'Body Analyzer', 'ECG'];
    this.patientVitals = {};
    screeningDetails.map((item: any, index: number) => {
      const approvedItem = displayItems.findIndex(dItem => dItem === item.pocType);
      if (approvedItem != -1) {
        this.patientVitals[(item.pocType === 'Body Analyzer' ? 'Body_Analyzer' : item.pocType)] = {
          'pocDate': (item?.pocDateTime) ? item?.pocDateTime?.split(" ")[0] : '--',
          'pocTime': (item?.pocDateTime) ? item?.pocDateTime?.split(" ")[1] : '--',
          'pocResult': item?.pocResult
        };
      }
    });
    // console.log('this.patientVitals ', this.patientVitals);
  }

  onCloseClick() {
    this.closeClick.emit();
  }

  renderValidatedValue(value: string) {
    return value ? value : '--'
  }

}
