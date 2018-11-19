import {} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks';

import './body.html';
import './task';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      return Tasks.find({ checked: false }, { sort: { createdAt: -1 } });
    }
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: false }).count();
  }
});

Template.body.events({
  'submit .new-task'(e) {
    e.preventDefault();

    Meteor.call('tasks.insert', e.target.text.value);

    e.target.text.value = '';
  },
  'click .hide-completed input'(e, instance) {
    instance.state.set('hideCompleted', e.target.checked);
  }
});