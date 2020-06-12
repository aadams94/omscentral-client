import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import * as sentry from '@sentry/browser';

import { apolloConfig } from 'src/config';
import { browserHistory } from 'src/constants';

/* eslint-disable no-useless-computed-key */
const errorCodes: { [key: string]: number } = {
  ['Bad Request']: 400,
  ['Forbidden']: 403,
  ['Not Found']: 404,
};
/* eslint-enable no-useless-computed-key */

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ networkError, graphQLErrors, operation }) => {
      sentry.captureException({ networkError, graphQLErrors, operation });
      const { message } = (graphQLErrors || [])[0] || {};
      browserHistory.push(`/error/${errorCodes[message] || 500}`);
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
