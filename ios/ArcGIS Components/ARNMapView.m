
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

@interface ARNMapView ()

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
  
  //inserting a default graphics overlay
  _graphicsOverlay = [AGSGraphicsOverlay graphicsOverlay];
  [_mapView.graphicsOverlays addObject:_graphicsOverlay];
  
  [self addSubview:_mapView];

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

-(void)addGraphics:(NSArray <AGSGraphic *> *)graphics {
  [_graphicsOverlay.graphics addObjectsFromArray:graphics];
}


@end
