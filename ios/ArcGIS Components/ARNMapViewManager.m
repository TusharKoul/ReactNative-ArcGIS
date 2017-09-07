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

RCT_CUSTOM_VIEW_PROPERTY(callout, AGSCallout, ARNMapView) {
  if(json) {
    json = [RCTConvert NSDictionary:json];
    json[@"point"] = [RCTConvert AGSPoint:json[@"point"]];
    [view setCalloutDetails:[RCTConvert NSDictionary:json]];
  }
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


RCT_EXPORT_METHOD(identifyGraphicsOverlays:(nonnull NSNumber *)reactTag
                  screenPoint:(CGPoint)screenPoint
                  tolerance:(double)tolerance
                  returnPopupsOnly:(BOOL)returnPopupsOnly
                  maximumResults:(int)maximumResults
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [_bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
    ARNMapView *mapView = (ARNMapView *)viewRegistry[reactTag];
    [mapView identifyGraphicsOverlaysAtScreenPoint:screenPoint
                                         tolerance:tolerance
                                  returnPopupsOnly:returnPopupsOnly
                                    maximumResults:maximumResults
                                          resolver:resolve rejecter:reject];
  }];
}


RCT_EXPORT_VIEW_PROPERTY(onTap, RCTBubblingEventBlock);

-(NSDictionary *)constantsToExport {
  return @{
           @"GeometryType":@{
               @"AGSGeometryTypePoint":@(AGSGeometryTypePoint),
               @"AGSGeometryTypePolyline":@(AGSGeometryTypePolyline),
               @"AGSGeometryTypePolygon":@(AGSGeometryTypePolygon)
               },
           @"PointSymbolStyles": @{
               @"AGSSimpleMarkerSymbolStyleCircle":@(AGSSimpleMarkerSymbolStyleCircle),
               @"AGSSimpleMarkerSymbolStyleCross":@(AGSSimpleMarkerSymbolStyleCross),
               @"AGSSimpleMarkerSymbolStyleDiamond":@(AGSSimpleMarkerSymbolStyleDiamond),
               @"AGSSimpleMarkerSymbolStyleSquare":@(AGSSimpleMarkerSymbolStyleSquare),
               @"AGSSimpleMarkerSymbolStyleTriangle":@(AGSSimpleMarkerSymbolStyleTriangle),
               @"AGSSimpleMarkerSymbolStyleX":@(AGSSimpleMarkerSymbolStyleX),
               },
           @"LineSymbolStyles": @{
               @"AGSSimpleLineSymbolStyleDash":@(AGSSimpleLineSymbolStyleDash),
               @"AGSSimpleLineSymbolStyleDashDot":@(AGSSimpleLineSymbolStyleDashDot),
               @"AGSSimpleLineSymbolStyleDashDotDot":@(AGSSimpleLineSymbolStyleDashDotDot),
               @"AGSSimpleLineSymbolStyleDot":@(AGSSimpleLineSymbolStyleDot),
               @"AGSSimpleLineSymbolStyleNull":@(AGSSimpleLineSymbolStyleNull),
               @"AGSSimpleLineSymbolStyleSolid":@(AGSSimpleLineSymbolStyleSolid),
               },
           @"FillSymbolStyles": @{
               @"AGSSimpleFillSymbolStyleBackwardDiagonal":@(AGSSimpleFillSymbolStyleBackwardDiagonal),
               @"AGSSimpleFillSymbolStyleCross":@(AGSSimpleFillSymbolStyleCross),
               @"AGSSimpleFillSymbolStyleDiagonalCross":@(AGSSimpleFillSymbolStyleDiagonalCross),
               @"AGSSimpleFillSymbolStyleForwardDiagonal":@(AGSSimpleFillSymbolStyleForwardDiagonal),
               @"AGSSimpleFillSymbolStyleHorizontal":@(AGSSimpleFillSymbolStyleHorizontal),
               @"AGSSimpleFillSymbolStyleNull":@(AGSSimpleFillSymbolStyleNull),
               @"AGSSimpleFillSymbolStyleSolid":@(AGSSimpleFillSymbolStyleSolid),
               @"AGSSimpleFillSymbolStyleVertical":@(AGSSimpleFillSymbolStyleVertical),
               },
           };
}

@end
