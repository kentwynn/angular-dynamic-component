import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChildren,
  Injector,
  OnInit,
  QueryList,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { ChildComponent } from '../child/child.component';
import { Children, getRootViewRef } from '../shared/untils';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent
  implements OnInit, AfterViewInit, AfterContentInit
{
  @ViewChild('parentView', { static: true, read: ViewContainerRef })
  parentView!: ViewContainerRef;
  @ContentChildren(Children)
  public children!: QueryList<ChildComponent>;
  singleValue: any;
  stringValue: any[] = [];
  objectValue = {
    title: 'tes',
    value: Math.random(),
  };
  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  ngAfterContentInit(): void {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // console.log(`child length.`, this.parentView.length);
  }

  onCreateComponent() {
    const componentRef = this.createComponent<ChildComponent>(ChildComponent);
    componentRef.instance.viewRef = componentRef.hostView;
    componentRef.instance.parentView = this.parentView;
    this.moveViewRefTo(
      this.parentView,
      componentRef.hostView,
      this.parentView?.length
    );
    const array = this.children.toArray();
    this.children.reset([...array, componentRef.instance]);
    console.log(`child length.`, this.parentView.length);
    console.log(`children`, this.children);
  }

  createComponent<T>(component: Type<T>): ComponentRef<T> {
    const factory = this.resolver.resolveComponentFactory<T>(component);
    const componentRef = factory.create(this.injector);
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  moveViewRefTo(vcr: ViewContainerRef, viewRef: ViewRef, to: number): void {
    vcr.move(viewRef, to);
  }

  changeValue() {
    this.stringValue.push(Math.random());
  }
}
