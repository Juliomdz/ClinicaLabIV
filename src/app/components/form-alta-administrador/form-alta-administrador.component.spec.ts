import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAltaAdministradorComponent } from './form-alta-administrador.component';

describe('FormAltaAdministradorComponent', () => {
  let component: FormAltaAdministradorComponent;
  let fixture: ComponentFixture<FormAltaAdministradorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormAltaAdministradorComponent]
    });
    fixture = TestBed.createComponent(FormAltaAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
