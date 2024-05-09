import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timerFormat'
})
export class TimerFormatPipe implements PipeTransform {
  transform(value: number): string {
    // Convert time value to a formatted string (e.g., HH:MM:SS)
    const hours: number = Math.floor(value / 3600);
    const minutes: number = Math.floor((value % 3600) / 60);
    const seconds: number = value % 60;

    const formattedHours: string = hours < 10 ? '0' + hours : hours.toString();
    const formattedMinutes: string = minutes < 10 ? '0' + minutes : minutes.toString();
    const formattedSeconds: string = seconds < 10 ? '0' + seconds : seconds.toString();

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
