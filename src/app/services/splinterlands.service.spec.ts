import { TestBed } from '@angular/core/testing';

import { SplinterlandsService } from './splinterlands.service';

describe('SplinterlandsService', () => {
  let service: SplinterlandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplinterlandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
