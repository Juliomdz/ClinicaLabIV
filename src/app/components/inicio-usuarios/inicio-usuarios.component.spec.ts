import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioUsuariosComponent } from './inicio-usuarios.component';

describe('InicioUsuariosComponent', () => {
  let component: InicioUsuariosComponent;
  let fixture: ComponentFixture<InicioUsuariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InicioUsuariosComponent]
    });
    fixture = TestBed.createComponent(InicioUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
