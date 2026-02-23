import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  private chartInstance: any;
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {
    this.users$ = this.userService.users$;
  }

  ngOnInit(): void {
    // initialize chart only when users list has values
    this.users$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
      if (users?.length) {
        this.initializeChart(users);
      }
    });
  }

  async initializeChart(users: User[]) {
    // lazy load chart.js only when users list has values
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
            borderWidth: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // destroy chart instance
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
