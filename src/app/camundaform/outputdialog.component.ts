import { Component, OnInit, Input, Inject } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CamundaOperatorService } from '../services/camundaoperator.service';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { VariableInput } from 'src/graphql/generated';

export interface DialogData {
    formId: string;
    processDefId: string;
    taskId: string;
  }
  

// The component for the form dialog
@Component({
    selector: 'output-dialog',
    templateUrl: './outputdialog.html',
  })
  export class OutputDialog implements OnInit {
  
    formGroup!: FormGroup;
    fields!: FormlyFieldConfig [];
    options!: FormlyFormOptions;
    model!: any;

    constructor(
      public dialogRef: MatDialogRef<OutputDialog>, private operatorService: CamundaOperatorService,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    ngOnInit(): void {
        this.camundaService.getForm(this.data.formId, this.data.processDefId).subscribe(form => { this.getSchema(form.schema) });
    }

    onSubmit(): void {
        console.dir("model: " + JSON.stringify(this.model));
        var myVars:  VariableInput[] = [];
        for (var key in this.model) {
            // Need to add quotes around the value for Camunda
            this.model[key] = "\"" + this.model[key] + "\"";
            myVars.push({name: key, value: this.model[key]});
        }
        this.camundaService.completeTask(this.data.taskId, myVars).subscribe();
        this.dialogRef.close();
    }
    
    onNoClick(): void {
    this.dialogRef.close();
    }
  
    getSchema(schema: any) {
        var jsonComponents: any;
        console.log("in getSchema: " + schema);
        jsonComponents = JSON.parse(schema);
        
        const jsonSchemaPreamble: string = "{ \"title\": \"Camunda Workflow form\",\n\"description\": \"A simple form example.\", \n \"type\": \"object\",\n\"required\": [\"Zipcode\"],\n\"properties\":{\n";
    
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
    
        //this.type = 'simple';
        this.formGroup = new FormGroup({});
        this.options = {};
        this.fields = [this.formlyJsonschema.toFieldConfig(JSON.parse(jsonFieldsStr))];
        this.model = {};
      }

  
  }