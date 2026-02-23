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
    { name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Admin' },
    { name: 'Bob Smith', email: 'bob.smith@example.com', role: 'Editor' },
    { name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Viewer' },
    { name: 'David Wilson', email: 'david.w@example.com', role: 'Editor' },
    { name: 'Eva Davis', email: 'eva.d@example.com', role: 'Viewer' },
    { name: 'Frank Miller', email: 'frank.m@example.com', role: 'Admin' },
    { name: 'Grace Hopper', email: 'grace.h@example.com', role: 'Admin' },
    { name: 'Henry Ford', email: 'henry.f@example.com', role: 'Editor' },
    { name: 'Ivy League', email: 'ivy.l@example.com', role: 'Viewer' },
    { name: 'Jack Reacher', email: 'jack.r@example.com', role: 'Editor' },
    { name: 'Kelly Clarkson', email: 'kelly.c@example.com', role: 'Viewer' },
    { name: 'Liam Neeson', email: 'liam.n@example.com', role: 'Admin' },
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
