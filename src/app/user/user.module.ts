import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import * as userComponents from './components';
import { TabAuthorInfoComponent } from './components/tab-author-info/tab-author-info.component';
import { TabUserInfoComponent } from './components/tab-user-info/tab-user-info.component';
import * as userContainers from './containers';

@NgModule({
    imports: [SharedModule],
    declarations: [
        ...userContainers.containers,
        ...userComponents.components,
        TabUserInfoComponent,
        TabAuthorInfoComponent,
    ],
    entryComponents: [...userComponents.components],
})
export class UserModule {}
