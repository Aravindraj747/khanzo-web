import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-termsand-condition',
  templateUrl: './termsand-condition.component.html',
  styleUrls: ['./termsand-condition.component.css']
})
export class TermsandConditionComponent implements OnInit {

  constructor(private http: HttpClient,
    private sanitizer: DomSanitizer) { }

  terms: any = undefined;
  ngOnInit(): void {
    this.http.get('assets/termsandconditions.html', { responseType: 'text' }).subscribe(
      data => this.terms = this.sanitizer.bypassSecurityTrustHtml(data)
    );
  }
}
