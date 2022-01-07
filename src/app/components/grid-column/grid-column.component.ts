import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'spl-grid-column',
  templateUrl: './grid-column.component.html',
  styleUrls: ['./grid-column.component.scss']
})
export class GridColumnComponent implements OnInit {

  @Input() title?: string;
  @Input() mainBodyText?: string;
  @Input() subBodyText?: string;
  @Input() icon?: GridIcon;

  constructor() { }

  ngOnInit(): void {
  }
}

export interface GridIcon {
  directory: string;
  link: string;
}
