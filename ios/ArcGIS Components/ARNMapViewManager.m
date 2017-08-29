//
//  ARNMapViewManager.m
//  ArcGISReactSample
//
//  Created by Tushar Koul on 8/23/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "ARNMapViewManager.h"
#import "ARNMapView.h"
#import "RCTConvert+ArcGIS.h"
#import <React/RCTLog.h>

@implementation ARNMapViewManager

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;


-(UIView *)view {
  return [[ARNMapView alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

RCT_CUSTOM_VIEW_PROPERTY(viewPointCenter, AGSPoint, ARNMapView) {
  RCTLogInfo(@"%@",view);
  RCTLogInfo(@"%@",defaultView);
  AGSPoint *point;
  if(json) {
    point = [RCTConvert AGSPoint:json];
  }
  [view setViewPointCenter:point];
}


@end
