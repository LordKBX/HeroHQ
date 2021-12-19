/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataConnectorService } from './data-connector.service';

describe('DataConnectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataConnectorService]
    });
  });

  it('should ...', inject([DataConnectorService], (service: DataConnectorService) => {
    expect(service).toBeTruthy();
  }));
});
