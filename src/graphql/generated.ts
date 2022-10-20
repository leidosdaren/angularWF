import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** Describes task embedded form */
export type Form = {
  __typename?: 'Form';
  /** The unique identifier of the embedded form within one process */
  id: Scalars['String'];
  /** Reference to process definition */
  processDefinitionId: Scalars['String'];
  /** Form content */
  schema: Scalars['String'];
};

/** What can be changed. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Claim a task with taskId to currently logged in user. Returns the task. */
  claimTask: Task;
  /** Complete a task with taskId and optional variables. Returns the task. */
  completeTask: Task;
  /** Delete process instance by given processInstanceId. Returns true if process instance could be deleted. */
  deleteProcessInstance: Scalars['Boolean'];
  /** Unclaim a task with taskId. Returns the task. */
  unclaimTask: Task;
};


/** What can be changed. */
export type MutationClaimTaskArgs = {
  assignee?: InputMaybe<Scalars['String']>;
  taskId: Scalars['String'];
};


/** What can be changed. */
export type MutationCompleteTaskArgs = {
  taskId: Scalars['String'];
  variables: Array<VariableInput>;
};


/** What can be changed. */
export type MutationDeleteProcessInstanceArgs = {
  processInstanceId: Scalars['String'];
};


/** What can be changed. */
export type MutationUnclaimTaskArgs = {
  taskId: Scalars['String'];
};

/** What can be searched for. */
export type Query = {
  __typename?: 'Query';
  /** Get currently logged in user. */
  currentUser: User;
  /** Get task form by id and processDefinitionId */
  form?: Maybe<Form>;
  /** Get one task by id. Returns task or error when task does not exist. */
  task: Task;
  /** Get list of tasks based on `TaskQuery`. */
  tasks: Array<Task>;
  /** Get the variables by variable id */
  variable: Variable;
  /** Get a collection of Variables by name */
  variables: Array<Variable>;
};


/** What can be searched for. */
export type QueryFormArgs = {
  id: Scalars['String'];
  processDefinitionId: Scalars['String'];
};


/** What can be searched for. */
export type QueryTaskArgs = {
  id: Scalars['String'];
};


/** What can be searched for. */
export type QueryTasksArgs = {
  query: TaskQuery;
};


/** What can be searched for. */
export type QueryVariableArgs = {
  id: Scalars['String'];
};


/** What can be searched for. */
export type QueryVariablesArgs = {
  taskId: Scalars['String'];
  variableNames: Array<Scalars['String']>;
};

/** Describes the User task. */
export type Task = {
  __typename?: 'Task';
  /** Username/id of who is assigned to the task */
  assignee?: Maybe<Scalars['String']>;
  /** Candidate groups */
  candidateGroups?: Maybe<Array<Scalars['String']>>;
  /** When was the task completed */
  completionTime?: Maybe<Scalars['String']>;
  /** When was the task created */
  creationTime: Scalars['String'];
  /** Reference to the task form */
  formKey?: Maybe<Scalars['String']>;
  /** The unique identifier of the task */
  id: Scalars['ID'];
  /** Flag to show that the task is first in current filter */
  isFirst?: Maybe<Scalars['Boolean']>;
  /** Name of the task */
  name: Scalars['String'];
  /** Reference to process definition */
  processDefinitionId?: Maybe<Scalars['String']>;
  /** Name of the process */
  processName: Scalars['String'];
  /** Array of values to be copied into `TaskQuery` to request for next or previous page of tasks. */
  sortValues?: Maybe<Array<Scalars['String']>>;
  /** Task Definition ID (node BPMN id) of the process */
  taskDefinitionId: Scalars['String'];
  /** State of the task */
  taskState: TaskState;
  /** Variables associated to the task */
  variables?: Maybe<Array<Variable>>;
};

/** Task query - query to get one page of tasks. */
export type TaskQuery = {
  /** Are the tasks assigned? */
  assigned?: InputMaybe<Scalars['Boolean']>;
  /** Who is assigned to the tasks? */
  assignee?: InputMaybe<Scalars['String']>;
  /** given group is in candidate groups list */
  candidateGroup?: InputMaybe<Scalars['String']>;
  /** Size of tasks page (default: 50). */
  pageSize?: InputMaybe<Scalars['Int']>;
  /** Array of values copied from `sortValues` of one of the tasks, query will return page of tasks going directly after this values plus same sort values. */
  searchAfter?: InputMaybe<Array<Scalars['String']>>;
  /** Array of values copied from `sortValues` of one of the tasks, query will return page of tasks going directly after this values. */
  searchAfterOrEqual?: InputMaybe<Array<Scalars['String']>>;
  /** Array of values copied from `sortValues` of one of the tasks, query will return page of tasks going directly before this values plus same sort values. */
  searchBefore?: InputMaybe<Array<Scalars['String']>>;
  /** Array of values copied from `sortValues` of one of the tasks, query will return page of tasks going directly before this values. */
  searchBeforeOrEqual?: InputMaybe<Array<Scalars['String']>>;
  /** State of the tasks */
  state?: InputMaybe<TaskState>;
  /** Task definition ID - what's the BPMN flow node? */
  taskDefinitionId?: InputMaybe<Scalars['String']>;
};

/** State of the task. */
export enum TaskState {
  Canceled = 'CANCELED',
  Completed = 'COMPLETED',
  Created = 'CREATED'
}

/** Describes the user. */
export type User = {
  __typename?: 'User';
  displayName?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Scalars['String']>>;
  roles?: Maybe<Array<Maybe<Scalars['String']>>>;
  salesPlanType?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
};

/** Variable used in task. */
export type Variable = {
  __typename?: 'Variable';
  id: Scalars['ID'];
  /** shows, whether previewValue contains truncated value or full value */
  isValueTruncated: Scalars['Boolean'];
  name: Scalars['String'];
  /** value preview (limited in size) */
  previewValue: Scalars['String'];
  /** full variable value */
  value: Scalars['String'];
};

/** Change or add a variable with name and value. */
export type VariableInput = {
  /** Name of the variable. */
  name: Scalars['String'];
  /** Value of the variable. Complex values, e.g. a list of objects, must be serialized as JSON. */
  value: Scalars['String'];
};

export type FormQueryVariables = Exact<{
  id: Scalars['String'];
  processDefinitionId: Scalars['String'];
}>;


export type FormQuery = { __typename?: 'Query', form?: { __typename?: 'Form', id: string, processDefinitionId: string, schema: string } | null };

export type TasksQueryVariables = Exact<{
  query: TaskQuery;
}>;


export type TasksQuery = { __typename?: 'Query', tasks: Array<{ __typename?: 'Task', id: string, name: string, taskDefinitionId: string, processName: string, creationTime: string, completionTime?: string | null, assignee?: string | null, taskState: TaskState, sortValues?: Array<string> | null, isFirst?: boolean | null, formKey?: string | null, processDefinitionId?: string | null, candidateGroups?: Array<string> | null, variables?: Array<{ __typename?: 'Variable', id: string, name: string, value: string, previewValue: string, isValueTruncated: boolean }> | null }> };

export type ClaimTaskMutationVariables = Exact<{
  taskId: Scalars['String'];
  assignee?: InputMaybe<Scalars['String']>;
}>;


export type ClaimTaskMutation = { __typename?: 'Mutation', claimTask: { __typename?: 'Task', id: string, name: string, taskDefinitionId: string, processName: string, creationTime: string, completionTime?: string | null, assignee?: string | null, taskState: TaskState, sortValues?: Array<string> | null, isFirst?: boolean | null, formKey?: string | null, processDefinitionId?: string | null, candidateGroups?: Array<string> | null, variables?: Array<{ __typename?: 'Variable', id: string, name: string, value: string, previewValue: string, isValueTruncated: boolean }> | null } };

export type CompleteTaskMutationVariables = Exact<{
  taskId: Scalars['String'];
  variables: Array<VariableInput> | VariableInput;
}>;


export type CompleteTaskMutation = { __typename?: 'Mutation', completeTask: { __typename?: 'Task', id: string, name: string, taskDefinitionId: string, processName: string, creationTime: string, completionTime?: string | null, assignee?: string | null, taskState: TaskState, sortValues?: Array<string> | null, isFirst?: boolean | null, formKey?: string | null, processDefinitionId?: string | null, candidateGroups?: Array<string> | null, variables?: Array<{ __typename?: 'Variable', id: string, name: string, value: string, previewValue: string, isValueTruncated: boolean }> | null } };

export const FormDocument = gql`
    query form($id: String!, $processDefinitionId: String!) {
  form(id: $id, processDefinitionId: $processDefinitionId) {
    id
    processDefinitionId
    schema
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FormGQL extends Apollo.Query<FormQuery, FormQueryVariables> {
    document = FormDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const TasksDocument = gql`
    query tasks($query: TaskQuery!) {
  tasks(query: $query) {
    id
    name
    taskDefinitionId
    processName
    creationTime
    completionTime
    assignee
    variables {
      id
      name
      value
      previewValue
      isValueTruncated
    }
    taskState
    sortValues
    isFirst
    formKey
    processDefinitionId
    candidateGroups
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class TasksGQL extends Apollo.Query<TasksQuery, TasksQueryVariables> {
    document = TasksDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ClaimTaskDocument = gql`
    mutation claimTask($taskId: String!, $assignee: String) {
  claimTask(taskId: $taskId, assignee: $assignee) {
    id
    name
    taskDefinitionId
    processName
    creationTime
    completionTime
    assignee
    variables {
      id
      name
      value
      previewValue
      isValueTruncated
    }
    taskState
    sortValues
    isFirst
    formKey
    processDefinitionId
    candidateGroups
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ClaimTaskGQL extends Apollo.Mutation<ClaimTaskMutation, ClaimTaskMutationVariables> {
    document = ClaimTaskDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CompleteTaskDocument = gql`
    mutation completeTask($taskId: String!, $variables: [VariableInput!]!) {
  completeTask(taskId: $taskId, variables: $variables) {
    id
    name
    taskDefinitionId
    processName
    creationTime
    completionTime
    assignee
    variables {
      id
      name
      value
      previewValue
      isValueTruncated
    }
    taskState
    sortValues
    isFirst
    formKey
    processDefinitionId
    candidateGroups
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CompleteTaskGQL extends Apollo.Mutation<CompleteTaskMutation, CompleteTaskMutationVariables> {
    document = CompleteTaskDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }