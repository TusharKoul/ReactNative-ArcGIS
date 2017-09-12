//
//  RCTMapViewManager.m
//  ArcGISReactSample
//
//  Created by Tushar Koul on 8/23/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RCTMapViewManager.h"
#import "RCTMapView.h"
#import "RCTConvert+ArcGIS.h"
#import <React/RCTLog.h>
#import <React/RCTBridge.h>
#import <React/UIView+React.h>
#import <React/RCTUIManager.h>

@implementation RCTMapViewManager

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;


-(UIView *)view {
  return [[RCTMapView alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

RCT_CUSTOM_VIEW_PROPERTY(viewPointCenter, AGSPoint, RCTMapView) {
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
    RCTMapView *mapView = (RCTMapView *)viewRegistry[reactTag];
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
    RCTMapView *mapView = (RCTMapView *)viewRegistry[reactTag];
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
