//
//  RCTCalloutView.m
//  ArcGISReactSample
//
//  Created by Tushar Koul on 9/7/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RCTCalloutView.h"
#import <React/UIView+React.h>
#import "ARNMapView.h"

@implementation RCTCalloutView

-(void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex {
  [super insertReactSubview:subview atIndex:atIndex];
  self.customView = subview;
}

// Once react native sends props down till here, our setters need to inform MapView to update its AGSCallout reference

-(void)setVisible:(BOOL)visible{
  if(_visible == visible) { return; }
  _visible = visible;
  [self.mapDelegate setCalloutView:self];
}

-(void)setTitle:(NSString *)title {
  _title = title;
  [self.mapDelegate setCalloutView:self];
}

-(void)setDetail:(NSString *)detail {
  _detail = detail;
  [self.mapDelegate setCalloutView:self];
}

-(void)setShowAtPoint:(AGSPoint *)showAtPoint {
  _showAtPoint = showAtPoint;
  [self.mapDelegate setCalloutView:self];
}

@end
