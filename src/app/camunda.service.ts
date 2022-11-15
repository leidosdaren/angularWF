import { Injectable } from '@angular/core';
import {Apollo, gql, QueryRef} from 'apollo-angular';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import {FormGQL, FormQuery, Form, TasksGQL, TaskQuery, Task, TasksQuery, ClaimTaskGQL, TaskState, CompleteTaskGQL, VariableInput, VariablesQuery, VariablesGQL} from '../graphql/generated';

@Injectable({
  providedIn: 'root',
})
export class CamundaService {
  camundaForm!: Observable<FormQuery['form']>
  tasks!: Observable<TasksQuery['tasks']>
  myTask!: any;
  taskQuery: TaskQuery = {state: TaskState.Created};
  createdTasksQuery: TaskQuery = {state: TaskState.Created};

  //camundaForm: Observable<FormQuery>
  formSchema!: string;
  
  constructor(private formGQL: FormGQL, private tasksGQL: TasksGQL, private claimTaskGQL: ClaimTaskGQL, 
    private completeTaskGQL: CompleteTaskGQL, private variablesGQL: VariablesGQL) {  }

  getTasks(query: TaskQuery) : Observable<TasksQuery['tasks']> {
    
    //return(this.tasksGQL.watch({query: query}).valueChanges.pipe(map(result => result.data.tasks)));
    return(this.tasksGQL.watch({query: this.taskQuery}).valueChanges.pipe(map(result => result.data.tasks)));
    
  }

  getVariables(taskId: string, variables: string[]) : Observable<VariablesQuery['variables']> {
    return(this.variablesGQL.watch({taskId: taskId, variableNames: variables}).valueChanges.pipe(map(result => result.data.variables)));
  }

  getForm(id: string, processDefinitionId: string) : Observable<FormQuery['form']> {
     
    this.camundaForm = this.formGQL.watch({id: id, processDefinitionId: processDefinitionId}).valueChanges.pipe(map(result => result.data.form));

    return this.camundaForm;

  }

  claimTask(taskId: string, assignee: string) {
    //console.log("in camunda service, claimTask.  taskId: " + taskId + ", assignee: " + assignee);
    //this.claimTaskGQL.mutate({taskId: taskId, assignee: assignee}).subscribe(result => console.log(result.data?.claimTask.assignee));
    return this.claimTaskGQL.mutate({taskId: taskId, assignee: assignee});
    //return this.myTask;
  }

  completeTask(taskId: string, variables: VariableInput[]) {
    //console.log("Completing task: " + taskId + ", with variables: " + JSON.stringify(variables));
    return this.completeTaskGQL.mutate({taskId: taskId, variables: variables});

  }

}