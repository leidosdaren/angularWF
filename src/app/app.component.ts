import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CamundaService } from './camunda.service';
import { CamundaFormComponent } from './camundaform/camundaform.component';
import { FormQuery, TaskState, Task } from 'src/graphql/generated';
import { Observable } from 'rxjs';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { TaskQuery } from 'src/graphql/generated';
import { subscribe } from 'graphql';


@Component({
    selector: 'wfApp',
    templateUrl: './app.component.html',
  })

  
  
  export class AppComponent implements OnInit {
  
  @Output() messageEvent = new EventEmitter<string>();

  constructor(private camundaService: CamundaService, private formlyJsonschema: FormlyJsonschema) {}

  showForm: boolean = false;
    taskFormId!: string;
    processDefinitionId!: string;
    zipcode!: string;

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  fields: FormlyFieldConfig[] = [
        {
            key: 'taskFormId',
            type: 'input',
            props: {
                label: 'Task Form Id',
                placeholder: 'taskFormId',
                required: true,
            },
        },
    ];

  ngOnInit() {

 
    
   }

  onSubmit(model: Object) {
    console.log("app component showForm set to true, taskFormId = " + this.model['taskFormId']);
    this.showForm = true;
    this.taskFormId = "\"" + this.model['taskFormId'] + "\"";
  }

}