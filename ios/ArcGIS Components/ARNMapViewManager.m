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
#import <React/RCTBridge.h>
#import <React/UIView+React.h>
#import <React/RCTUIManager.h>

@implementation ARNMapViewManager

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;


-(UIView *)view {
  return [[ARNMapView alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

RCT_CUSTOM_VIEW_PROPERTY(viewPointCenter, AGSPoint, ARNMapView) {
  AGSPoint *point;
  if(json) {
    point = [RCTConvert AGSPoint:json];
  }
  [view setViewPointCenter:point];
}

RCT_EXPORT_METHOD(addGraphics:(nonnull NSNumber *)reactTag
                  graphics:(nonnull NSArray *)graphics)
{
  [_bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
    ARNMapView *mapView = (ARNMapView *)viewRegistry[reactTag];
    NSArray <AGSGraphic *> *graphicsToAdd = [RCTConvert AGSGraphics:graphics];
    [mapView addGraphics:graphicsToAdd];
  }];
}


@end
