import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks';

import './body.html';
import './task';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      return Tasks.find({ checked: false }, { sort: { createdAt: -1 } });
    }
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
});

Template.body.events({
  'submit .new-task'(e) {
    e.preventDefault();

    Tasks.insert({
      text: e.target.text.value,
      createdAt: new Date(),
      checked: false
    });

    e.target.text.value = '';
  },
  'click .hide-completed input'(e, instance) {
    instance.state.set('hideCompleted', e.target.checked);
  }
});