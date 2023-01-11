import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalComponent } from 'src/app/components/modal/modal.component';

import { HardAndSoftSkillsComponent } from './hard-and-soft-skills.component';

describe('HardAndSoftSkillsComponent', () => {
  let component: HardAndSoftSkillsComponent;
  let fixture: ComponentFixture<HardAndSoftSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule],
      declarations: [HardAndSoftSkillsComponent, ModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HardAndSoftSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
