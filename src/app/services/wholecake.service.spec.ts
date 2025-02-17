import { TestBed } from '@angular/core/testing';

import { WholecakeService } from './wholecake.service';

describe('WholecakeService', () => {
  let service: WholecakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WholecakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
