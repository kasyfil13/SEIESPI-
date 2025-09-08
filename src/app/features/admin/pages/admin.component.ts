import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone:true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  users = [
    { username: 'jdoe', role: 'Auditor' },
    { username: 'asmith', role: 'Manager' },
    { username: 'admin', role: 'Admin' }
  ];

  addUser() {
    alert('Add new user!');
  }

  editUser(user: any) {
    alert(`Editing User: ${user.username}`);
  }

  deleteUser(username: string) {
    this.users = this.users.filter(u => u.username !== username);
    alert('Deleted user: ' + username);
  }
}
