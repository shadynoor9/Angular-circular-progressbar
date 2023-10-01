import { Component, Input, OnInit } from '@angular/core';
import { AngularCircularProgressbarService } from './angular-circular-progressbar.service';

@Component({
  selector: 'angular-circular-progressbar',
  template: `
    <svg
      class="progress-circle"
      [style.width]="radius * 2.24 + 'px'"
      [style.height]="radius * 2.24 + 'px'"
    >
      <circle
        class="circle-background"
        [attr.stroke]="bgStrokeColor"
        [attr.stroke-width]="bgStrokeWidth"
        [attr.fill]="bgStrokeFill"
        [attr.r]="radius"
        cx="50%"
        cy="50%"
      />

      <circle
        class="progress"
        [attr.stroke]="progressStrokeColor"
        [attr.stroke-width]="progressStrokeWidth"
        [attr.fill]="progressStrokeFill"
        [attr.r]="radius"
        cx="50%"
        cy="50%"
        [attr.stroke-linecap]="strokeLinecap"
      />

      <circle
        class="handle"
        [attr.stroke]="handleBorderColor"
        [attr.stroke-width]="handleBorderWidth"
        [attr.fill]="handleFillColor"
        [attr.r]="handleRadius"
        cx="50%"
        cy="50%"
        [ngClass]="{ 'handle-shadow': defaultShadow }"
        [ngStyle]="{
          filter: filterValue
        }"
      />

      <text
        x="50%"
        y="50%"
        class="percent"
        [attr.font-size]="fontSize"
        [attr.font-family]="fontFamily"
        [attr.font-weight]="fontWeight"
        [attr.fill]="textColor"
        dominant-baseline="middle"
        text-anchor="middle"
      >
        50 %
      </text>
      <text
        *ngIf="mutedText"
        x="50%"
        y="70%"
        [attr.font-size]="mutedFontSize"
        [attr.font-family]="mutedFontFamily"
        [attr.font-weight]="mutedFontWeight"
        [attr.fill]="mutedTextColor"
        dominant-baseline="middle"
        text-anchor="middle"
      >
        {{ mutedText }}
      </text>
    </svg>
  `,
  styles: [
    `
      circle.progress {
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
      }
      svg {
        display: block;
        margin: auto;
      }
      .handle-shadow {
        -webkit-filter: drop-shadow(-1px 4px 2px rgba(0, 0, 0, 0.25));
        filter: drop-shadow(-1px 4px 2px rgba(0, 0, 0, 0.25));
      }
    `,
  ],
})
export class AngularCircularProgressbarComponent implements OnInit {
  @Input() percentage: number = 0;
  @Input() radius: number = 0;
  @Input() width: any;

  @Input() fontSize: number = 0;
  @Input() fontFamily!: string;
  @Input() fontWeight: number = 400;
  @Input() textColor!: string;

  @Input() bgStrokeColor!: string;
  @Input() bgStrokeWidth!: number;
  @Input() bgStrokeFill!: string;

  @Input() progressStrokeColor!: string;
  @Input() progressStrokeWidth!: number;
  @Input() progressStrokeFill!: string;

  @Input() handleRadius!: number;
  @Input() handleBorderWidth!: number;
  @Input() handleBorderColor!: string;
  @Input() handleFillColor!: string;

  @Input() strokeLinecap!: string;
  @Input() clockWise!: boolean;
  @Input() reversedText!: boolean;
  @Input() defaultShadow!: boolean;
  @Input() filterValue!: string;

  @Input() mutedText!: string;
  @Input() mutedFontSize!: number;
  @Input() mutedFontFamily!: string;
  @Input() mutedFontWeight!: number;
  @Input() mutedTextColor!: string;
  @Input() responsive!: boolean;

  constructor(private platform: AngularCircularProgressbarService) {}

  ngOnInit(): void {
    if (this.responsive && this.platform.isBrowser) {
      if (window.innerWidth > 1600) {
        this.width = this.width * 0.8;
        this.radius = this.radius * 0.8;
        this.fontSize = this.fontSize * 0.8;
        this.bgStrokeWidth = this.bgStrokeWidth * 0.8;
        this.progressStrokeWidth = this.progressStrokeWidth * 0.8;
        this.handleRadius = this.handleRadius * 0.8;
        this.mutedFontSize = this.mutedFontSize * 0.8;
      }
    }

    const circle: any = document.querySelector('circle.progress');
    const circleBg: any = document.querySelector('.circle-background');
    const svg: any = document.querySelector('.progress-circle');

    const width = this.width ? this.width : this.radius * 2.3;
    const clockWise = this.clockWise;
    const reversedText = this.reversedText;

    svg.style.width = width;
    svg.style.height = width;

    circle.r.baseVal.value = this.radius;
    circleBg.r.baseVal.value = this.radius;

    let radius = circle.r.baseVal.value;
    let circumference = radius * 2 * Math.PI;

    let originX = width / 2;
    let originY = width / 2;

    const percentText: any = document.querySelector('text.percent');

    const handle: any = document.querySelector('circle.handle');

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    function setProgress(percent: any) {
      if (reversedText) {
        percentText.innerHTML = percent + '%';
      } else {
        percentText.innerHTML = '%' + percent;
      }

      let reverse_percent = 100 - percent;
      let offset = (reverse_percent / 100) * circumference;

      if (clockWise) {
        circle.style.strokeDashoffset = 1 * offset;
      } else {
        circle.style.strokeDashoffset = -1 * offset;
      }

      // circle.style.cx = width - originX;

      setHandleRotation(percent);
    }

    // Position the handle at the end of the stroke
    function setHandleRotation(percent: any) {
      let angle = (180 + percent * 3.6) % 360;

      // Convert degrees to radians
      let angle_radians = (angle * Math.PI) / 180;

      let xOffset = radius * Math.sin(angle_radians);
      let yOffset = radius * Math.cos(angle_radians);

      let x;
      if (clockWise) {
        x = originX + -xOffset;
      } else {
        x = originX + xOffset;
      }
      let y = originY + yOffset;

      handle.attributes.cx.value = x;
      handle.attributes.cy.value = y;
    }

    setProgress(this.percentage);
  }
}
