import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
}

export interface Toast {
  id: number;
  message: string;
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
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastSubject.asObservable();

  constructor() {}

  // add user to users list
  addUser(user: User) {
    const existingUsers = this.usersSubject.value;
    this.usersSubject.next([...existingUsers, user]);
    this.addToast('User added successfully');
  }

  // add toast
  addToast(message: string) {
    const id = Date.now();
    const currentToasts = this.toastSubject.value;
    this.toastSubject.next([...currentToasts, { id, message }]);

    // auto-remove toast after 5 seconds
    setTimeout(() => {
      this.removeToast(id);
    }, 5000);
  }

  removeToast(id: number) {
    const currentToasts = this.toastSubject.value;
    this.toastSubject.next(currentToasts.filter((t) => t.id !== id));
  }
}
