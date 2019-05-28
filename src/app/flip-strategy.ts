import {
  NzCarouselBaseStrategy,
  NzCarouselContentDirective
} from 'ng-zorro-antd';
import { Observable, Subject, timer } from 'rxjs';
import { QueryList } from '@angular/core';

export class FlipStrategy extends NzCarouselBaseStrategy {
  withCarouselContents(
    contents: QueryList<NzCarouselContentDirective> | null
  ): void {
    super.withCarouselContents(contents);

    if (this.contents) {
      this.slickListEl.style.width = `${this.length * this.unitWidth}px`;

      this.contents.forEach(
        (content: NzCarouselContentDirective, i: number) => {
          const cur = this.carouselComponent.activeIndex === i;

          this.renderer.setStyle(
            content.el,
            'transform',
            cur ? 'rotateY(0deg)' : 'rotateY(180deg)'
          );
          this.renderer.setStyle(content.el, 'position', 'relative');
          this.renderer.setStyle(content.el, 'width', `${this.unitWidth}px`);
          this.renderer.setStyle(
            content.el,
            'left',
            `${-this.unitWidth * i}px`
          );

          this.renderer.setStyle(content.el, 'transform-style', 'preserve-3d');
          this.renderer.setStyle(content.el, 'backface-visibility', 'hidden');
        }
      );

      timer(200).subscribe(() => {
        this.contents.forEach(c =>
          this.renderer.setStyle(c.el, 'transition', [
            'transform 500ms ease 0s'
          ])
        );
      });
    }
  }

  switch(f_: number, t_: number): Observable<void> {
    console.log(f_, t_);

    const { from, to } = this.getFromToInBoundary(f_, t_);
    const complete$ = new Subject<void>();
    const speed = this.carouselComponent.nzTransitionSpeed;

    timer(speed).subscribe(() => {
      complete$.next();
      complete$.complete();
    });

    if (f_ === t_) {
      return complete$;
    }

    this.contents.forEach((content: NzCarouselContentDirective, i: number) => {
      if (i === from) {
        this.renderer.setStyle(content.el, 'transform', 'rotateY(180deg)');
      } else if (i === to) {
        this.renderer.setStyle(content.el, 'transform', 'rotateY(0deg)');
      }
    });

    return complete$;
  }

  dragging(): void {
    console.log('d');
  }

  dispose(): void {
    this.contents.forEach((content: NzCarouselContentDirective) => {
      this.renderer.setStyle(content.el, 'transition', null);
    });

    super.dispose();
  }
}
