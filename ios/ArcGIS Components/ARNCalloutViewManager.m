

//
//  ARNCalloutViewManager.m
//  ArcGISReactSample
//
//  Created by Tushar Koul on 9/7/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "ARNCalloutViewManager.h"
#import "ARNCalloutView.h"

#import "RCTConvert+ArcGIS.h"

@implementation ARNCalloutViewManager

RCT_EXPORT_MODULE()

-(UIView *)view{
  return [[ARNCalloutView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(visible, BOOL);
RCT_EXPORT_VIEW_PROPERTY(title, NSString);
RCT_EXPORT_VIEW_PROPERTY(detail, NSString);

RCT_CUSTOM_VIEW_PROPERTY(showAtPoint, AGSPoint, ARNCalloutView) {
  AGSPoint *point;
  if(json) {
    point = [RCTConvert AGSPoint:json];
  }
  view.showAtPoint = point;
}

@end
