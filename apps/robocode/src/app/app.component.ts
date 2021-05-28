import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'rc-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private http: HttpClient) {}

  async test() {
    console.log('test');
    await this.http.get('/api').toPromise();
  }
}
