//
//  ARNMapViewManager.m
//  ArcGISReactSample
//
//  Created by Tushar Koul on 8/23/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "ARNMapViewManager.h"
#import "ARNMapView.h"


@implementation ARNMapViewManager

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;


-(UIView *)view {
  ARNMapView *mapView = [[ARNMapView alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
  return mapView;
}


@end
