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
@class AGSCallout;
@class ARNCalloutView;


@interface ARNMapView : RCTView

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher;

// when we define RCT_CUSTOM_PROPERTY in view manager we specify a view
// The property should be defined on the view also as so-
- (void)setViewPointCenter:(AGSPoint *)center;
- (void)setCalloutView:(ARNCalloutView *)calloutView;

- (void)addGraphics:(NSArray <AGSGraphic *> *)graphics;

- (void)identifyGraphicsOverlaysAtScreenPoint:(CGPoint)screenPoint
                                   tolerance:(double)tolerance
                            returnPopupsOnly:(BOOL)returnPopupsOnly
                              maximumResults:(int)maximumResults
                                    resolver:(RCTPromiseResolveBlock)resolve
                                    rejecter:(RCTPromiseRejectBlock)reject;

@property (nonatomic, copy) RCTBubblingEventBlock onTap;


@end
