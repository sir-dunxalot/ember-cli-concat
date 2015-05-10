import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Integration - Concatenation', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('Default options', function(assert) {
  // application = startApp({
  //   emberCliConcat: {
  //     css: {
  //       concat: true
  //     },
  //     js: {
  //       concat: true,
  //       contentFor: 'poop'
  //     }
  //   }
  // });

  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/',
    'The Ember application will boot up');
  });
});
