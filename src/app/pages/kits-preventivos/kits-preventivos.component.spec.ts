import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitsPreventivosComponent } from './kits-preventivos.component';

describe('KitsPreventivosComponent', () => {
  let component: KitsPreventivosComponent;
  let fixture: ComponentFixture<KitsPreventivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitsPreventivosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KitsPreventivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
