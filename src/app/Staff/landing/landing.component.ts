import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private http:HttpClient,
              private sanitizer:DomSanitizer) { }

  landing :any = undefined;
  ngOnInit(): void {
    this.http.get('assets/index.html', { responseType: 'text' }).subscribe(
      data => this.landing = this.sanitizer.bypassSecurityTrustHtml(data)
    );
  }
}
