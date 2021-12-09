import { ComponentRef } from '@angular/core';

// https://github.com/angular/angular/blob/master/packages/core/src/render3/interfaces/view.ts#L30
const TVIEW = 1;
const FLAGS = 2;
const PARENT = 3;

// https://github.com/angular/angular/blob/master/packages/core/src/render3/interfaces/container.ts#L20
const TYPE = 1;
const VIEW_REFS = 8;

// https://github.com/angular/angular/blob/master/packages/core/src/render3/context_discovery.ts#L176
const MONKEY_PATCH_KEY_NAME = '__ngContext__';

// https://github.com/angular/angular/blob/master/packages/core/src/render3/context_discovery.ts#L191
function readPatchedData(target: any) {
  return target[MONKEY_PATCH_KEY_NAME] || null;
}

// https://github.com/angular/angular/blob/master/packages/core/src/render3/context_discovery.ts#L196
function readPatchedLView(target: any) {
  const value = readPatchedData(target);
  if (value) {
    return Array.isArray(value) ? value : value.lView;
  }
  return null;
}

// https://github.com/angular/angular/blob/master/packages/core/src/render3/interfaces/type_checks.ts#L20
function isLView(value: any) {
  return Array.isArray(value) && typeof value[TYPE] === 'object';
}

// https://github.com/angular/angular/blob/master/packages/core/src/render3/interfaces/type_checks.ts#L28
function isLContainer(value: any) {
  return Array.isArray(value) && value[TYPE] === true;
}

function getLViewParent(lView: any) {
  const parent = lView[PARENT];
  return isLContainer(parent) ? parent[PARENT] : parent;
}

// https://github.com/angular/angular/blob/master/packages/core/src/render3/util/view_utils.ts#L161
function viewAttachedToContainer(view: any) {
  return isLContainer(view[PARENT]);
}

export function getLView(componentOrLView: any) {
  return isLView(componentOrLView)
    ? componentOrLView
    : readPatchedLView(componentOrLView);
}

// https://github.com/angular/angular/blob/master/packages/core/src/render3/interfaces/type_checks.ts#L48
export function isRootView(target: any) {
  return (target[FLAGS] & 512) /* IsRoot */ !== 0; // eslint-disable-line
}

function getRootLView(componentOrLView: any) {
  let lView = getLView(componentOrLView);
  // tslint:disable-next-line:no-bitwise
  while (lView && !((lView[FLAGS] & 512) /* IsRoot */)) {
    lView = getLViewParent(lView);
  }
  return lView;
}

export function getRootViewRef(component: any) {
  const lView = getLView(component);
  if (viewAttachedToContainer(lView)) {
    const lContainer = lView[PARENT];
    const rootViewRefs = lContainer[VIEW_REFS];
    if (rootViewRefs && rootViewRefs.length > 0) {
      const rootViewRef = rootViewRefs.find((vr: any) => {
        return vr._lView === lView;
      });
      return rootViewRef;
    }
  }
  return null;
}

export function getComponentFromLView(lView: any) {
  const tNode = lView[TVIEW].firstChild;
  const directiveIndexStart = tNode.directiveStart;
  // https://github.com/angular/angular/blob/68d4de6770361099491ab0aa84ed2b58c64d39cb/packages/core/src/render3/interfaces/node.ts#L413
  return lView[directiveIndexStart];
}

export function getComponent(rootViewRef: any) {
  const lView = rootViewRef._lView;
  return getComponentFromLView(lView);
}

export class Children {}
