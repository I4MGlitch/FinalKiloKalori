import { TestBed } from '@angular/core/testing';

import { TiramisuService } from './tiramisu.service';

describe('TiramisuService', () => {
  let service: TiramisuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiramisuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
