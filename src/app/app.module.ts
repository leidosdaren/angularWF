import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { CamundaService } from './camunda.service';
import { CamundaFormComponent } from './camundaform/camundaform.component';
import { TaskFormComponent } from './taskform/taskform.component';
import { ObjectTypeComponent } from './object.type';
import { CamundaOperatorService } from './services/camundaoperator.service';
import { ZipcodeComponent } from './zipcode/zipcode.component';

@NgModule({
  imports: [
    CommonModule, BrowserModule, AppRoutingModule, MatIconModule, FormlyMaterialModule,
    ReactiveFormsModule, BrowserAnimationsModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      types: [
        { name: 'object', component: ObjectTypeComponent },
      ],
    }),
    GraphQLModule,
    HttpClientModule,
  ],
  providers: [CamundaService, CamundaOperatorService],
  bootstrap: [AppComponent],
  declarations: [AppComponent, CamundaFormComponent, ObjectTypeComponent, TaskFormComponent, ZipcodeComponent],
})
export class AppModule {}
