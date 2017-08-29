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

+ (AGSSuggestParameters *)AGSSuggestParameters:(NSDictionary *)json;
+ (AGSGeocodeParameters *)AGSGeocodeParameters:(NSDictionary *)json;

@end
