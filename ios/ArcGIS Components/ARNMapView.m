
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


@interface ARNMapView ()

@end

@implementation ARNMapView
{
  RCTEventDispatcher *_eventDispatcher;
  AGSMapView *_mapView;
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
  _mapView.map = [AGSMap mapWithBasemapType:AGSBasemapTypeDarkGrayCanvasVector
                                   latitude:100.0
                                  longitude:100.0
                              levelOfDetail:2];
  _mapView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
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



@end
