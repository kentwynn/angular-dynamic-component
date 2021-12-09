import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentComponent } from './parent.component';
import { ParentRoutingModule } from './parent-routing.module';
import { ChildModule } from '../child/child.module';

@NgModule({
  declarations: [ParentComponent],
  imports: [CommonModule, ParentRoutingModule, ChildModule],
  exports: [ParentComponent],
})
export class ParentModule {}
