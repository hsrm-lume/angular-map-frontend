import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeControlsComponent } from './mode-controls.component';

describe('ModeControlsComponent', () => {
  let component: ModeControlsComponent;
  let fixture: ComponentFixture<ModeControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
