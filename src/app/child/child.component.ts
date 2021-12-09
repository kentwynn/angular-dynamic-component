import {
  AfterViewInit,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Children } from '../shared/untils';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss'],
  providers: [
    { provide: Children, useExisting: forwardRef(() => ChildComponent) },
  ],
})
export class ChildComponent implements OnInit, AfterViewInit, OnChanges {
  ramdom: any;
  @Input()
  parentView!: ViewContainerRef;
  viewRef!: ViewRef;
  @Input() singleValue: any;
  @Input() stringValue: any = [];
  @Input() objectValue: any;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`changes`, changes);
  }

  ngOnInit(): void {
    this.ramdom = Math.random();
  }

  ngAfterViewInit(): void {}

  onRemoveComponent() {
    if (!this.parentView || !this.viewRef) return;
    const currentIndex = this.parentView.indexOf(this.viewRef);
    this.parentView.remove(currentIndex);
  }

  onMoveUp() {
    let currentIndex = this.parentView.indexOf(this.viewRef);
    this.parentView.move(this.viewRef, currentIndex--);
  }

  onMoveDown() {
    let currentIndex = this.parentView.indexOf(this.viewRef);
    this.parentView.move(this.viewRef, currentIndex++);
  }
}
