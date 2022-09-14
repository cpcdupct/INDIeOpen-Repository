import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import * as questionsComponents from './components';
import * as questionsContainers from './containers';

@NgModule({
    imports: [SharedModule],
    declarations: [...questionsContainers.containers, ...questionsComponents.components],
    entryComponents: [...questionsComponents.components],
})
export class QuestionsModule {}
