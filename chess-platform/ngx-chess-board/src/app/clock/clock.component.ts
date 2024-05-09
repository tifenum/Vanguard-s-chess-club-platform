import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.scss'
})
export class ClockComponent implements OnInit, OnDestroy ,OnChanges {
  @Input() clockOpened: boolean = true;
  remainingTime: number = 10 * 60; // 10 minutes en secondes
  timerId: any;

  constructor() { }

  ngOnInit(): void {
    if (this.clockOpened) {
      this.startClock();
    }
  }

  startClock(): void {
    this.timerId = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.clockOpened)
    if (changes.clockOpened && !changes.clockOpened.firstChange) {
      if (this.clockOpened) {
        this.startClock();
      } else {
        this.stopClock();
      }
    }
  }
  stopClock(): void {
    clearInterval(this.timerId);
  }

  formatTime(seconds: number): string {
    // const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}