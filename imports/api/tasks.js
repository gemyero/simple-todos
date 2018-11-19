import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not authorized!');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      checked: false
    });
  },
  'tasks.remove'(id) {
    check(id, String);

    const task = Tasks.findOne(id);

    if (!Meteor.userId() || (task.username !== Meteor.user().username)) {
      throw new Meteor.Error('not authorized!');
    }

    Tasks.remove(id);
  },
  'tasks.toggleChecked'(id) {
    check(id, String);

    const task = Tasks.findOne(id);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not authorized!');
    }

    Tasks.update(id, {$set: { checked: !task.checked }});
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});