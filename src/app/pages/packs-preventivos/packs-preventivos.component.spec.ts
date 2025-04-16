import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacksPreventivosComponent } from './packs-preventivos.component';

describe('PacksPreventivosComponent', () => {
  let component: PacksPreventivosComponent;
  let fixture: ComponentFixture<PacksPreventivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacksPreventivosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacksPreventivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
