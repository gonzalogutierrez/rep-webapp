// Developed by Houlak
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsDetailComponent } from './requests-detail.component';

describe('RequestsDetailComponent', () => {
  let component: RequestsDetailComponent;
  let fixture: ComponentFixture<RequestsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
