import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalComponent } from '../../modal/modal.component';
import { NavComponent } from '../../nav/nav.component';
import { AboutmeComponent } from './aboutme/aboutme.component';
import { DetailComponent } from './detail/detail.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { HardAndSoftSkillsComponent } from './hard-and-soft-skills/hard-and-soft-skills.component';

import { PortfolioComponent } from './portfolio.component';
import { ProjectComponent } from './project/project.component';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [
        PortfolioComponent,
        NavComponent,
        DetailComponent,
        AboutmeComponent,
        ExperienceComponent,
        EducationComponent,
        HardAndSoftSkillsComponent,
        ProjectComponent,
        ModalComponent
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
