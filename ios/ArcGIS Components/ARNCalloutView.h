//
//  ARNCalloutView.h
//  ArcGISReactSample
//
//  Created by Tushar Koul on 9/7/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <React/RCTView.h>
@class AGSPoint;
@class ARNMapView;

@interface ARNCalloutView : RCTView

@property(nonatomic, getter=isVisible) BOOL visible;

@property(nonatomic, strong) AGSPoint *showAtPoint;
@property(nonatomic, copy) NSString *title;
@property(nonatomic, copy) NSString *detail;

@property(nonatomic, weak) UIView *customView;

@property(nonatomic, weak) ARNMapView *mapDelegate;

@end
