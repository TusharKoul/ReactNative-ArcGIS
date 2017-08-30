//
//  RCTConvert+ArcGIS.h
//  ArcGISReactSample
//
//  Created by Tushar Koul on 8/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <React/RCTConvert.h>
#import <ArcGIS/ArcGIS.h>

@interface RCTConvert (ArcGIS)

+ (AGSPoint *)AGSPoint:(id)json;
+ (AGSGeometry *)AGSGeometry:(id)json;
+ (AGSSpatialReference *)AGSSpatialReference:(id)json;
+ (NSArray<AGSGraphic *> *)AGSGraphics:(id)json;

+ (AGSSuggestParameters *)AGSSuggestParameters:(id)json;
+ (AGSGeocodeParameters *)AGSGeocodeParameters:(id)json;

@end
