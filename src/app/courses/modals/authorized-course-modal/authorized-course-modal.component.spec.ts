import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedCourseModalComponent } from './authorized-course-modal.component';

describe('AuthorizedCourseModalComponent', () => {
  let component: AuthorizedCourseModalComponent;
  let fixture: ComponentFixture<AuthorizedCourseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizedCourseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedCourseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
