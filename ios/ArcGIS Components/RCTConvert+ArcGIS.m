//
//  RCTConvert+ArcGIS.m
//  ArcGISReactSample
//
//  Created by Tushar Koul on 8/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RCTConvert+ArcGIS.h"

@implementation RCTConvert (ArcGIS)

+(AGSSuggestParameters *)AGSSuggestParameters:(NSDictionary *)json {
  json = [self NSDictionary:json];
  AGSSuggestParameters *param = [[AGSSuggestParameters alloc] init];
  
  param.categories = json[@"categories"];
  param.countryCode = json[@"countryCode"];
  param.maxResults = [json[@"maxResults"] integerValue];
  
  //TODO: convert AGSPoint and AGSGeometry
  //TODO: error handling
  
  return param;
}

+(AGSGeocodeParameters *)AGSGeocodeParameters:(NSDictionary *)json {
  json = [self NSDictionary:json];
  AGSGeocodeParameters *param = [[AGSGeocodeParameters alloc] init];
  
  //TODO: convert completely
  
  return param;
}

@end
