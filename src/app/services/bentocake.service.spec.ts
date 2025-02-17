import { TestBed } from '@angular/core/testing';

import { BentocakeService } from './bentocake.service';

describe('BentocakeService', () => {
  let service: BentocakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BentocakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
