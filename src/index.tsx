import React from 'react';
import { render } from 'react-dom';
import { Helmet } from 'react-helmet';
import CssBaseline from '@material-ui/core/CssBaseline';

import Apollo from './components/Apollo';
import App from './components/App';
import Auth from './components/Auth';
import ErrorBoundary from './components/ErrorBoundary';
import Firebase from './components/Firebase';
import Notification from './components/Notification';
import Sentry from './components/Sentry';
import Theme from './components/Theme';

render(
  <ErrorBoundary>
    <CssBaseline>
      <Theme>
        <Apollo>
          <Firebase>
            <Auth>
              <Notification>
                <Helmet
                  titleTemplate="%s | OMSCentral"
                  defaultTitle="OMSCentral"
                />
                <Sentry />
                <App />
              </Notification>
            </Auth>
          </Firebase>
        </Apollo>
      </Theme>
    </CssBaseline>
  </ErrorBoundary>,
  document.getElementById('root'),
);
