import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './task.html';

Template.task.events({
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
  'click .toggle-checked'() {
    Meteor.call('tasks.toggleChecked', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
});

Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});