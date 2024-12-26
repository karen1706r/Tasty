import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const puntero = document.querySelector('.puntero') as HTMLElement;

    document.addEventListener('mousemove', (e) => {
      if (puntero) {
        puntero.style.left = (e.clientX - puntero.offsetWidth / 2) + 'px';
        puntero.style.top = (e.clientY - puntero.offsetHeight / 2) + 'px';
      }
    });

    document.addEventListener('mouseenter', () => {
      if (puntero) {
        puntero.style.display = 'block';
      }
    });

    document.addEventListener('mouseleave', () => {
      if (puntero) {
        puntero.style.display = 'none';
      }
    });
  }
}
