import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private http:HttpClient,
    private sanitizer: DomSanitizer) { }

  contact : any = undefined;
  ngOnInit(): void {
    this.http.get('assets/contact.html', { responseType: 'text' }).subscribe(
      data => this.contact = this.sanitizer.bypassSecurityTrustHtml(data)
    );
  }

}
