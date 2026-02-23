import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  @Output() close = new EventEmitter<void>();
  userForm: FormGroup;

  roles: User['role'][] = ['Admin', 'Editor', 'Viewer'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['Viewer', Validators.required],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value);
      this.close.emit();
    }
  }

  onCancel() {
    this.close.emit();
  }
}
