import { Component, OnInit, Input, Inject } from '@angular/core';
import { CamundaService } from '../camunda.service';
import { FormQuery, TaskState, Task, VariableInput, TasksGQL } from 'src/graphql/generated';
import { map, Observable } from 'rxjs';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { TaskQuery, TasksQuery } from 'src/graphql/generated';
import { subscribe } from 'graphql';
import { CamundaOperatorService } from '../services/camundaoperator.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormDialog } from './formdialog.component';

const ASSIGNEE = "Daren Arnold (AngularWF)";

export interface DialogData {
  formId: string;
  processDefId: string;
  taskId: string;
}

@Component({
  selector: 'camundaform',
  templateUrl: './camundaform.component.html',
  styleUrls: ['./camundaform.component.css']
})

export class CamundaFormComponent implements OnInit {
  
    
  createdTasks!: Observable<Task[]> 
  completedTasks!: Observable<Task[]>

    // This will be passed from the parent tfid form
    @Input() taskFormId: string = '';

  constructor(private camundaService: CamundaService, 
    private operatorService: CamundaOperatorService,
    private tasksGQL: TasksGQL,
    private dialog: MatDialog) {}


    createdTasksQuery: TaskQuery = {state: TaskState.Created};
    completedTasksQuery: TaskQuery = {state: TaskState.Completed};
    
    claimTask(taskId: string): void {
      console.log("Claiming this task");
      this.camundaService.claimTask(taskId, ASSIGNEE).subscribe();
    }

    openFormDialog(formKey: string, processDefId: string, taskId: string): void {
      var formKeySplit = formKey.split(":");
      const dialogRef = this.dialog.open(FormDialog, {
        width: '250px',
        data: {formId: formKeySplit[2], processDefId: processDefId, taskId: taskId}
      }
    )}

    showOutput(): void {

    }


  ngOnInit() {

    this.createdTasks = this.tasksGQL.watch({query: this.createdTasksQuery}, {pollInterval: 30000})
        .valueChanges.pipe(map(result => result.data.tasks));

    this.completedTasks = this.tasksGQL.watch({query: this.completedTasksQuery}, {pollInterval: 30000})
        .valueChanges.pipe(map(result => result.data.tasks));
   }

  
}
