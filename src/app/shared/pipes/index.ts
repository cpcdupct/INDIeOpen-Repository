import { PrettyPrintPipe } from './pretty-print.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { TranslateCategoryPipe } from './translate-category.pipe';

export const pipes = [PrettyPrintPipe, TranslateCategoryPipe, SafeHtmlPipe];

export * from './pretty-print.pipe';
export * from './translate-category.pipe';
export * from './safe-html.pipe';
