import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css']
})
export class CancelComponent implements OnInit {

  constructor(private http:HttpClient,
    private sanitizer:DomSanitizer) { }

  cancel :any = undefined;
  ngOnInit(): void {
    this.http.get('assets/cancel.html', { responseType: 'text' }).subscribe(
      data => this.cancel = this.sanitizer.bypassSecurityTrustHtml(data)
    );
  }

}
