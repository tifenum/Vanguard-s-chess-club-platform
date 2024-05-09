import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaywithfriendsComponent } from './playwithfriends.component';

describe('PlaywithfriendsComponent', () => {
  let component: PlaywithfriendsComponent;
  let fixture: ComponentFixture<PlaywithfriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaywithfriendsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaywithfriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
