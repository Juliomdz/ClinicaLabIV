import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAltaPacienteComponent } from './form-alta-paciente.component';

describe('FormAltaPacienteComponent', () => {
  let component: FormAltaPacienteComponent;
  let fixture: ComponentFixture<FormAltaPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormAltaPacienteComponent]
    });
    fixture = TestBed.createComponent(FormAltaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
