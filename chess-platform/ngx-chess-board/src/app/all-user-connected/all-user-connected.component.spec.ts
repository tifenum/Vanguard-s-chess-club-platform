import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUserConnectedComponent } from './all-user-connected.component';

describe('AllUserConnectedComponent', () => {
  let component: AllUserConnectedComponent;
  let fixture: ComponentFixture<AllUserConnectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUserConnectedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllUserConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
