import { Component, OnInit, Input } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CamundaOperatorService } from '../services/camundaoperator.service';



@Component({
    selector: 'zipcode',
    templateUrl: './zipcode.component.html',
  })
  
  export class ZipcodeComponent implements OnInit {

    constructor (private operatorService: CamundaOperatorService) {}
    postcode!: string;
    zipcodeRet!: any;
    
    ngOnInit() {

        this.operatorService.getVariable().subscribe(variables => {
            this.zipcodeRet = JSON.parse(variables.items[0].value);
            this.postcode = this.zipcodeRet.body['post code'];
            console.dir(this.zipcodeRet)});

    }

  }
