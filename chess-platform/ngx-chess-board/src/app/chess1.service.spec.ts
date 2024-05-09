import { TestBed } from '@angular/core/testing';

import { Chess1Service } from './chess1.service';

describe('Chess1Service', () => {
  let service: Chess1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Chess1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
