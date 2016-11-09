import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Location, CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, inject, async } from '@angular/core/testing';

@Component({
  template: `<a routerLink="/dashboard/dc">dc</a><router-outlet></router-outlet>`
})

export class Aml {
    something: string = 'something';
}

@Component({
  template: ''
})
class DummyComponent {
}

describe('How to fake router link', function () {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([
         { path: 'dashboard/dc', component: DummyComponent }
        ])
      ],
      declarations: [ Aml, DummyComponent ]
    });
  });

  it('should go to url',
    async(inject([Router, Location], (router: Router, location: Location) => {

    let fixture = TestBed.createComponent(Aml);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('a')).nativeElement.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual('/dashboard/dc');
    });
  })));
});
