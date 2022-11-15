import { Component, OnInit, Input, Inject } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CamundaService } from '../camunda.service';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { Variable, VariableInput } from 'src/graphql/generated';

export interface DialogData {
    formId: string;
    processDefId: string;
    taskId: string;
  }
  

// The component for the form dialog
@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: './formdialog.html',
  })
  export class FormDialog implements OnInit {
  
    formGroup!: FormGroup;
    fields!: FormlyFieldConfig [];
    newFields!: FormlyFieldConfig [];
    options!: FormlyFormOptions;
    model!: any;
    variableList!: string[];

    constructor(
      public dialogRef: MatDialogRef<FormDialog>, private camundaService: CamundaService, private formlyJsonschema: FormlyJsonschema,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    ngOnInit(): void {
        this.variableList = new Array();
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
      let myFields: FormlyFieldConfig[] = [];
        var jsonComponents: any;
        //console.log("in getSchema: " + schema);
        jsonComponents = JSON.parse(schema);
        
        const jsonSchemaPreamble: string = "{ \"title\": \"Camunda Workflow form\",\n\"description\": \"A simple form example.\", \n \"type\": \"object\",\n\"required\": [\"Zipcode\"],\n\"properties\":{\n";
    
        let fieldsStr = "";
        let splitTextField: string[];
        let textFieldVar = "";
        let i=0;
        

        jsonComponents.components.forEach(obj => {
          switch(obj.type) {
            case "text": 
            if (obj.text.includes(":")) {
              // Text field contains a variable reference, so get the variable and incorporate it into the field label
              splitTextField = obj.text.split(":");
              textFieldVar = splitTextField[1].trim();
                
              this.camundaService.getVariables(this.data.taskId, [textFieldVar]).subscribe( variable => {  
              this.variableList.push(splitTextField[0] + variable[0].value);
              myFields.push({        
                className: 'section-label',
                template: '<hr /><div><strong>' + splitTextField[0] + ':</strong></div>' + variable[0].value
              })
            })
          }
            else {
              myFields.push({        
                className: 'section-label',
                template: '<hr /><div><strong>' + obj.text + '</strong></div>'
              })
            }
            break;
            case "textfield": console.log("element of type: textfield");
              myFields.push({
                key: obj.key,
                type: "input",
                id: obj.key,
                props: {
                  label: obj.label
                }
              });
              break;
            case "radio": console.log("");
              var optionArr = [];
              obj.values.forEach(option => optionArr.push({"value": option.value, "label": option.label}));
              
              myFields.push({
                key: obj.key,
                type: "radio",
                id: obj.key,
                props: {
                  label: obj.label,
                  description: obj.description,
                  options: optionArr
                }
              });
              
            break;
          }
            //console.log("formField label: " + obj.label + ", type: " + obj.type);
            /*
            console.log(JSON.stringify(obj));
            if (i>0) fieldsStr += ",";
            fieldsStr += "\"" + obj.key + "\": {\n \"type\": \"input\",\n \"id\": \"" + obj.key + "\",\n \"title\": \"" + obj.label + "\"\n}";
            i++;
            */
          // myFields.forEach(element => {console.log(element.className, element.template)});
            this.fields = myFields;
            
        })
    
        this.formGroup = new FormGroup({});
        this.options = {};
        this.model = {};
      }

  
  }