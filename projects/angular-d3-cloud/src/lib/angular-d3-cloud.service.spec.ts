import { TestBed } from '@angular/core/testing';
import { AngularD3CloudOptions } from './angular-d3-cloud.interfaces';
import { AngularD3CloudService } from './angular-d3-cloud.service';

describe('AngularD3CloudService', () => {
    let service: AngularD3CloudService;

    beforeEach(() => {
        TestBed.configureTestingModule({            
            providers: [ AngularD3CloudService ]
        });
       
        service = TestBed.inject(AngularD3CloudService);
    });

    it('should create the AngularD3CloudService service', () => {
        expect(service).toBeTruthy();
    });

    it('should sync render cloud with a valid Document Element and default options', () => {
        const div = document.createElement('div');
        const error = service.renderCloud(div);
        expect(error).toBeFalsy();
    });

    it('should not sync render cloud without a valid Document Element', () => {       
        const error = service.renderCloud(null);
        expect(error).toBeTruthy();
    });

    it('should not sync render cloud with a valid Document Element and empty options', () => {
        const div = document.createElement('div');
        const options = {} as AngularD3CloudOptions;
        const error = service.renderCloud(div, options);
        expect(error).toBeTruthy();
    });
});