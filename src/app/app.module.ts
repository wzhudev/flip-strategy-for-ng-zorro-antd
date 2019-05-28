import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NZ_CAROUSEL_CUSTOM_STRATEGIES, NzCarouselModule } from 'ng-zorro-antd';
import { FlipStrategy } from './flip-strategy';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NzCarouselModule],
  providers: [
    {
      provide: NZ_CAROUSEL_CUSTOM_STRATEGIES,
      useValue: [
        {
          name: 'flip',
          strategy: FlipStrategy
        }
      ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
