import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { apolloConfig } from '../config';
import { browserHistory } from '../constants';

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ networkError }) => {
      if (networkError) {
        // const code = (networkError as any).statusCode || 0;
        const code = 500;
        browserHistory.push(`/error/${code}`);
      }
    }),
    new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          Authorization: localStorage.getItem('token') || null,
        },
      });

      return forward(operation);
    }),
    new HttpLink({
      uri: apolloConfig.uri,
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
