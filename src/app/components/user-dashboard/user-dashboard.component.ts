import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';
import { Observable, Subject, takeUntil, combineLatest, map, BehaviorSubject } from 'rxjs';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  paginatedUsers$: Observable<User[]>;
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(5);
  totalPages$ = new BehaviorSubject<number>(1);

  showUserForm = false;
  private chartInstance: any;
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {
    this.users$ = this.userService.users$;

    // calculate total pages whenever users list changes
    this.users$.pipe(takeUntil(this.destroy$)).subscribe(users => {
      const totalPages = Math.ceil(users.length / this.pageSize$.value);
      this.totalPages$.next(totalPages || 1);
      
      // reset current page if it exceeds total pages
      if (this.currentPage$.value > totalPages && totalPages > 0) {
        this.currentPage$.next(totalPages);
      }
    });

    // logic for paginated users
    this.paginatedUsers$ = combineLatest<[User[], number, number]>([
      this.users$,
      this.currentPage$,
      this.pageSize$,
    ]).pipe(
      map(([users, currentPage, pageSize]) => {
        const startIndex = (currentPage - 1) * pageSize;
        return users.slice(startIndex, startIndex + pageSize);
      }),
    );
  }

  ngOnInit(): void {
    // initialize chart only when users list has values
    this.users$.pipe(takeUntil(this.destroy$)).subscribe((users: User[]) => {
      if (users?.length) {
        this.initializeChart(users);
      }
    });
  }

  async initializeChart(users: User[]) {
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);

    // count users by role
    const roleCounts = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // get canvas element
    const canvas = document.getElementById('roleChart') as HTMLCanvasElement;
    if (!canvas) return;

    // destroy previous chart instance if exists
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // create new chart instance
    this.chartInstance = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: Object.keys(roleCounts),
        datasets: [
          {
            data: Object.values(roleCounts),
            backgroundColor: ['#1c4980', '#383838', '#e3eafc'],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top', fullSize: true },
          title: {
            display: true,
            text: 'User Distribution by Role',
          },
        },
      },
    });
  }

  toggleUserForm() {
    this.showUserForm = !this.showUserForm;
  }

  nextPage() {
    // goto next page if current page is less than total pages
    if (this.currentPage$.value < this.totalPages$.value) {
      this.currentPage$.next(this.currentPage$.value + 1);
    }
  }

  prevPage() {
    // goto previous page if current page is greater than 1
    if (this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // destroy chart instance
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
