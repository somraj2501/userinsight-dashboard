import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([
    { name: 'Alice', email: 'alice@mail.com', role: 'Admin' },
    { name: 'Bob', email: 'bob@mail.com', role: 'Editor' },
    { name: 'Charlie', email: 'charlie@mail.com', role: 'Viewer' },
  ]);

  users$ = this.usersSubject.asObservable();

  constructor() {}

  // get list of users
  getUsers(): User[] {
    return this.usersSubject.value;
  }

  // add user to users list
  addUser(user: User) {
    const existingUsers = this.usersSubject.value;
    this.usersSubject.next([...existingUsers, user]);
  }
}
