import { Component, OnInit, Input } from '@angular/core';
import { CamundaService } from '../camunda.service';
import { FormQuery, TaskState, Task, VariableInput } from 'src/graphql/generated';
import { map, Observable } from 'rxjs';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { TaskQuery } from 'src/graphql/generated';
import { subscribe } from 'graphql';

/*
const id = "userTaskForm_3urvvtl";
const processDefinitionId = "2251799813690847";
const TASKID = "4503599627518230";
*/
const TASKFORMID = "\"TFID54321\"";
const ASSIGNEE = "Daren Arnold (AngularWF)";

@Component({
  selector: 'camundaform',

  templateUrl: './camundaform.component.html',
})

export class CamundaFormComponent implements OnInit {
  
    model: any | undefined;
    formGroup: FormGroup | undefined;
    //fields: FormlyFieldConfig[] | undefined;
    fields!: FormlyFieldConfig [];
    options:  FormlyFormOptions | undefined;
    camundaForm: Observable<FormQuery['form']> | undefined;
    type: string | undefined;

    // This will be passed from the parent tfid form
    @Input() taskFormId: string = '';

  constructor(private camundaService: CamundaService, private formlyJsonschema: FormlyJsonschema) {}

  tfidForm = new FormGroup({});
  tfidModel: any | undefined;
  tfiOptions: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  tfidFields: FormlyFieldConfig[] = [
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

    schema: any;
    components: any;
    myAssignee: any;
    myTask!: any;

    getTasks(tasks: any) {
        
        var myTasks = [];

        /*
        if (this.taskFormId == null) {
            alert("Please supply the taskFormId");
            return;
        }
        */

        // Camunda wants all variables wrapped with quotes
        this.taskFormId = "\"" + this.taskFormId + "\"";
        console.log("getTasks: " + this.taskFormId);
        const TASKFORMID = this.taskFormId;
        myTasks = tasks.filter(function (item)  { return (item.variables[0].value == TASKFORMID)});

        if (myTasks.length === 0) {
            alert("No remaining tasks");
            return;
        }
        // split the formkey to get the form ID in position 2
        var formSplit = myTasks[0].formKey.split(":");
        this.myTask = myTasks[0];
        //console.log ("Got: " + formSplit[2] + ", " + myTasks[0].id);
        console.dir(myTasks);
        this.camundaService.claimTask(myTasks[0].id, ASSIGNEE).subscribe();
        this.camundaService.getForm(formSplit[2], myTasks[0].processDefinitionId).subscribe(form => { this.getSchema(form.schema) });
        
    }

  getSchema(schema: any) {
    var jsonComponents: any;
    console.log("in getSchema: " + schema);
    this.schema = schema;
    jsonComponents = JSON.parse(schema);
    
    const jsonSchemaPreamble: string = "{ \"title\": \"A registration form\",\n\"description\": \"A simple form example.\", \n \"type\": \"object\",\n\"required\": [\"Zipcode\"],\n\"properties\":{\n";

    let fieldsStr = "";

    let i=0;
    jsonComponents.components.forEach(obj => {
        //console.log("formField label: " + obj.label + ", type: " + obj.type);
        //console.log(JSON.stringify(obj));
        if (i>0) fieldsStr += ",";
        fieldsStr += "\"" + obj.key + "\": {\n \"type\": \"string\",\n \"id\": \"" + obj.key + "\",\n \"title\": \"" + obj.label + "\"\n}";
        i++;
    })

    let jsonFieldsStr: any = jsonSchemaPreamble + fieldsStr + "\n} \n }";

    console.log(jsonFieldsStr);

    this.type = 'simple';
          this.formGroup = new FormGroup({});
          this.options = {};
          this.fields = [this.formlyJsonschema.toFieldConfig(JSON.parse(jsonFieldsStr))];
          this.model = {};
  }
  ngOnInit() {

    console.log("camundaform onInit: " + this.taskFormId);
    if ( this.taskFormId != null ) {
        console.log("camundaform onInit: taskFormID not null");
        this.camundaService.getTasks({}).subscribe(tasks => { this.getTasks(tasks)} );
    }
    else {
        return;
    }

    

    
   }

  onSubmit() {
    var myVars:  VariableInput[] = [];
    for (var key in this.model) {
        // Need to add quotes around the value for Camunda
        this.model[key] = "\"" + this.model[key] + "\"";
        myVars.push({name: key, value: this.model[key]});
    }
    //alert("task: " + this.myTask.name + ", ID: " + this.myTask.id + " -- Variables: " + JSON.stringify(myVars));
    this.camundaService.completeTask(this.myTask.id, myVars).subscribe();
 
  }

  
}
