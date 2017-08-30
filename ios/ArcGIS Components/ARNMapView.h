//
//  ARNMapView.h
//  ArcGISReactSample
//
//  Created by Tushar Koul on 8/23/17.
//  Copyright © 2017 Facebook. All rights reserved.
//


#import <React/RCTView.h>
#import <React/RCTEventDispatcher.h>

@class AGSPoint;
@class AGSGraphic;

@interface ARNMapView : RCTView

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher;

// when we define RCT_CUSTOM_PROPERTY in view manager we specify a view
// The property should be defined on the view also as so-
- (void)setViewPointCenter:(AGSPoint *)center;


-(void)addGraphics:(NSArray <AGSGraphic *> *)graphics;

@end
