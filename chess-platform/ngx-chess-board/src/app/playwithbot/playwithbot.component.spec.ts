import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaywithbotComponent } from './playwithbot.component';

describe('PlaywithbotComponent', () => {
  let component: PlaywithbotComponent;
  let fixture: ComponentFixture<PlaywithbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaywithbotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaywithbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
