import { Template } from 'meteor/templating';

import './task.html';
import { Tasks } from '../api/tasks';

Template.task.events({
  'click .delete'() {
    Tasks.remove(this._id);
  },
  'click .toggle-checked'() {
    Tasks.update(this._id, { $set: { checked: !this.checked } });
  }
});