import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache,ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

const uri = 'https://dsm-1.tasklist.camunda.io/e106da45-e2d7-45c1-b6d8-1c444f666691/graphql';
export function createApollo(httpLink: HttpLink) {
  
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));
  
  const auth = setContext((operation, context) => {
    const token = environment.CAMUNDA_AUTH_TOKEN;
    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          //'Access-Control-Allow-Origin': '*',
          //'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
          Authorization: `Bearer ${token}`
        }
      };
    }
  });
  
//const link = ApolloLink.from([basic, auth, httpLink.create({ uri: 'https://dsm-1.tasklist.camunda.io/daae4980-e22b-4299-b78f-308ec8ffbab2/graphql' })]);
 const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);

const cache = new InMemoryCache();

  return {
    link,
    cache
  }
}

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: createApollo,
    deps: [HttpLink]
  }]
})
export class GraphQLModule {}
