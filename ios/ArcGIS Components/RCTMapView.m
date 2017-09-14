
//  RCTMapView.m
//  ArcGISReactSample
//
//  Created by Tushar Koul on 8/23/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RCTMapView.h"
#import <ArcGIS/ArcGIS.h>

#import <React/RCTBridgeModule.h>
#import <React/UIView+React.h>
#import <React/RCTLog.h>

#import "RCTCalloutView.h"

@interface RCTMapView ()<AGSGeoViewTouchDelegate>

@property(nonatomic,weak)RCTCalloutView *calloutView;

@end

@implementation RCTMapView
{
  RCTEventDispatcher *_eventDispatcher;
  AGSMapView *_mapView;
  AGSPoint *_viewPointCenter;
  NSMutableDictionary<NSString *, AGSGraphicsOverlay *> *_graphicsOverlays;
}


-(instancetype)initWithEventDispatcher:(id)eventDispatcher {
  if (self = [super init]) {
    _eventDispatcher = eventDispatcher;
    _graphicsOverlays = [NSMutableDictionary dictionary];
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
  for(NSString *overlayId in _graphicsOverlays) {
      [_mapView.graphicsOverlays addObject:_graphicsOverlays[overlayId]];
  }
  
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


-(void)updateGraphicsOverlay:(AGSGraphicsOverlay *)newOverlay forKey:(NSString *)key{
  AGSGraphicsOverlay *oldOverlay = _graphicsOverlays[key];
  if(oldOverlay) {
    // if an oldOverlay with same key exists, that means its an update not a new addition
    // we need to replace the old overlay, so we copy the old graphics to new overlay
    [newOverlay.graphics addObjectsFromArray:oldOverlay.graphics];
    
    // remove old overlay
    [_mapView.graphicsOverlays removeObject:oldOverlay];
  }
  
  // set new overlay to local dictionary and to the map
  _graphicsOverlays[key] = newOverlay;
  [_mapView.graphicsOverlays addObject:newOverlay];
}

-(void)removeGraphicsOverlays:(NSArray *)toRemove{
  for (NSString *key in toRemove) {
    [_mapView.graphicsOverlays removeObject:_graphicsOverlays[key]];
    [_graphicsOverlays removeObjectForKey:key];
  }
}

-(void)setCalloutView:(RCTCalloutView *)calloutView {
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
  if ([subview isKindOfClass:[RCTCalloutView class]]){
    RCTCalloutView *calloutView = (RCTCalloutView *)subview;
    calloutView.mapDelegate = self;
    [self setCalloutView:calloutView];
  }
  else {
    [super insertReactSubview:subview atIndex:atIndex];
  }
}


-(void)addGraphics:(NSArray <AGSGraphic *> *)graphics toOverlay:(NSString *)overlayId {
  AGSGraphicsOverlay *overlay = _graphicsOverlays[overlayId];
  if(!overlay) {
    RCTLogWarn(@"overlay id doesn't exist");
    return;
  }
  [overlay.graphics addObjectsFromArray:graphics];
}

-(void)identifyGraphicsOverlays:(NSString *)overlayId
                    screenPoint:(CGPoint)screenPoint
                      tolerance:(double)tolerance
               returnPopupsOnly:(BOOL)returnPopupsOnly
                 maximumResults:(int)maximumResults
                       resolver:(RCTPromiseResolveBlock)resolve
                       rejecter:(RCTPromiseRejectBlock)reject  {
  
  AGSGraphicsOverlay *overlay = _graphicsOverlays[overlayId];
  if(!overlay) {
    RCTLogWarn(@"overlay id doesn't exist");
    return;
  }
  __weak __typeof__(self) welf = self;
  [_mapView identifyGraphicsOverlay:overlay
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
