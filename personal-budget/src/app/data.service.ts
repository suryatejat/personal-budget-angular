import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:3000/budget';
  // D3js Chart Data
  private budgetData: any[] = [];
  // Pie Chart Data
  private dataSource = {
    labels: [''],
    datasets:[
        {
            data: [''],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                '#CC0000',
                '#45818e',
                '#c90076',
                '#783f04',
                '#f6b26b'
            ],
        }
    ]
  };

  constructor(private http: HttpClient) { }

  getBudgetData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  populateDataSource(data: any): void{
    for(var i = 0; i < data.length; i++){
      this.dataSource.datasets[0].data[i] = data[i].budget;
      this.dataSource.labels[i] = data[i].title;
    }
  }

  getDataSource(): any{
    return this.dataSource;
  }

  setBudgetData(data: any[]): void {
    this.budgetData = data;
    this.populateDataSource(data);
  }

  getStoredBudgetData(): any[] {
    return this.budgetData;
  }

  isBudgetDataEmpty(): boolean {
    return this.budgetData.length === 0;
  }

  getBudget(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
