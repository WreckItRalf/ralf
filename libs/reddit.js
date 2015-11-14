var Snoocore = require('snoocore')

var reddit = new Snoocore({
  // Unique string identifying the app
  userAgent: 'ralf_app_v0.0.1',
  // It's possible to adjust throttle less than 1 request per second.
  // Snoocore will honor rate limits if reached.
  throttle: 300,
  oauth: {
    type: 'implicit',
    key: 'S72GlOn4qJSsVw', //this is public
    redirectUri: 'http://localhost:3000',
    // The OAuth scopes that we need to make the calls that we
    // want. The reddit documentation will specify which scope
    // is needed for evey call
    scope: [ 'history', 'read' ]
  }
});

module.exports = reddit; 