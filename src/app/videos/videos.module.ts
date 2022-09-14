import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import * as videosComponents from './components';
import * as videosContainers from './containers';

@NgModule({
    imports: [SharedModule],
    declarations: [...videosContainers.containers, ...videosComponents.components],
})
export class VideosModule {}
