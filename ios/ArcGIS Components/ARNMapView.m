
//  ARNMapView.m
//  ArcGISReactSample
//
//  Created by Tushar Koul on 8/23/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "ARNMapView.h"
#import <ArcGIS/ArcGIS.h>

#import <React/RCTBridgeModule.h>
#import <React/UIView+React.h>
#import <React/RCTLog.h>

#import "ARNCalloutView.h"

@interface ARNMapView ()<AGSGeoViewTouchDelegate>

@property(nonatomic,weak)ARNCalloutView *calloutView;

@end

@implementation ARNMapView
{
  RCTEventDispatcher *_eventDispatcher;
  AGSMapView *_mapView;
  AGSPoint *_viewPointCenter;
  AGSGraphicsOverlay *_graphicsOverlay;
}


-(instancetype)initWithEventDispatcher:(id)eventDispatcher {
  if (self = [super init]) {
    _eventDispatcher = eventDispatcher;
  }
  return self;
}

- (void)createMapIfNeeded
{
  CGRect bounds = self.bounds;
  if (_mapView || bounds.size.width <= 0 || bounds.size.height <= 0) {
    return;
  }
  
  _mapView = [[AGSMapView alloc] initWithFrame:self.bounds];
  CLLocationCoordinate2D coord = CLLocationCoordinate2DMake(100.0, 100.0);
  if(_viewPointCenter) {
    coord = _viewPointCenter.toCLLocationCoordinate2D;
  }
  _mapView.map = [AGSMap mapWithBasemapType:AGSBasemapTypeDarkGrayCanvasVector
                                   latitude:coord.latitude
                                  longitude:coord.longitude
                              levelOfDetail:2];
  _mapView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  _mapView.touchDelegate = self;
  //inserting a default graphics overlay
  _graphicsOverlay = [AGSGraphicsOverlay graphicsOverlay];
  [_mapView.graphicsOverlays addObject:_graphicsOverlay];
  
  [self addSubview:_mapView];

  [self updateCalloutView];
  [self layoutSubviews];
}


- (void)layoutSubviews
{
  [super layoutSubviews];
  
  if (!_mapView) {
    [self createMapIfNeeded];
  }
  _mapView.frame = self.bounds;
  [_mapView layoutSubviews];
}


-(void)setViewPointCenter:(AGSPoint *)center{
  _viewPointCenter = center;
  [_mapView setViewpointCenter:_viewPointCenter completion:nil];
}

-(void)setCalloutView:(ARNCalloutView *)calloutView {
  _calloutView = calloutView;
  if (_mapView) {
    [self updateCalloutView];
  }
}

-(void)updateCalloutView {
  if (_calloutView == nil)
    return;
  
  if(_calloutView.isVisible) {
    if (_calloutView.customView) {
      _mapView.callout.customView = _calloutView.customView;
    }
    else {
      _mapView.callout.title = _calloutView.title;
      _mapView.callout.detail = _calloutView.detail;
    }
    
    [_mapView.callout showCalloutAt:_calloutView.showAtPoint
                       screenOffset:CGPointZero
                rotateOffsetWithMap:false
                           animated:true];
  }
  else {
    [_mapView.callout dismiss];
  }
}

-(void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex {
  if ([subview isKindOfClass:[ARNCalloutView class]]){
    ARNCalloutView *calloutView = (ARNCalloutView *)subview;
    calloutView.mapDelegate = self;
    [self setCalloutView:calloutView];
  }
  else {
    [super insertReactSubview:subview atIndex:atIndex];
  }
}


-(void)addGraphics:(NSArray <AGSGraphic *> *)graphics {
  [_graphicsOverlay.graphics addObjectsFromArray:graphics];
}

-(void)identifyGraphicsOverlaysAtScreenPoint:(CGPoint)screenPoint
                                   tolerance:(double)tolerance
                            returnPopupsOnly:(BOOL)returnPopupsOnly
                              maximumResults:(int)maximumResults
                                    resolver:(RCTPromiseResolveBlock)resolve
                                    rejecter:(RCTPromiseRejectBlock)reject  {
  __weak __typeof__(self) welf = self;
  [_mapView identifyGraphicsOverlay:_graphicsOverlay
                        screenPoint:screenPoint
                          tolerance:tolerance
                   returnPopupsOnly:returnPopupsOnly
                     maximumResults:maximumResults
                         completion:^(AGSIdentifyGraphicsOverlayResult * _Nonnull identifyResult)
  {
    if([welf rejectWithError:identifyResult.error rejector:reject]) {
      return;
    }
    
    NSMutableArray *result = [NSMutableArray arrayWithCapacity:identifyResult.graphics.count];
    for(AGSGraphic *g in identifyResult.graphics) {
      NSError *error = nil;
      id geometryJson = [g.geometry toJSON:&error];
      if([welf rejectWithError:error rejector:reject]) {
        return;
      }

      id symbolJson = [g.symbol toJSON:&error];
      if([welf rejectWithError:error rejector:reject]) {
        return;
      }
      
      [result addObject:@{
                         @"geometry": geometryJson,
                         @"symbol": symbolJson,
                         @"attributes": g.attributes
                         }];
    }
    resolve(result);
  }];
}

-(BOOL)rejectWithError:(NSError *)error rejector:(RCTPromiseRejectBlock)reject {
  if(error) {
    reject(@(error.code).stringValue,error.localizedDescription,error);
    return YES;
  }
  return NO;
}


#pragma mark - AGSGeoViewTouchDelegate
-(void)geoView:(AGSGeoView *)geoView didTapAtScreenPoint:(CGPoint)screenPoint mapPoint:(AGSPoint *)mapPoint {
  if(!self.onTap) { return; }
  
  self.onTap(@{
               @"screenPoint": @{ @"x": @(screenPoint.x) , @"y": @(screenPoint.y) },
               @"mapPoint": [mapPoint toJSON:nil]
               });
}

@end
