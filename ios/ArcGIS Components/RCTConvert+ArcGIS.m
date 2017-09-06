//
//  RCTConvert+ArcGIS.m
//  ArcGISReactSample
//
//  Created by Tushar Koul on 8/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RCTConvert+ArcGIS.h"

@implementation RCTConvert (ArcGIS)

#define AGSJsonSerializableConvert(type)                  \
+ (type *)type:(id)json {                                 \
  NSError *error = nil;                                   \
  type *obj = (type *)[type fromJSON:json error:&error];  \
  if (!error) {                                           \
    return obj;                                           \
  }                                                       \
  else if(error && json) {                                \
    RCTLogConvertError(json, @#type);                     \
  }                                                       \
  return nil;                                             \
}

AGSJsonSerializableConvert(AGSPoint)
AGSJsonSerializableConvert(AGSSymbol)
AGSJsonSerializableConvert(AGSGeometry)
AGSJsonSerializableConvert(AGSSpatialReference)

+(AGSSuggestParameters *)AGSSuggestParameters:(id)json {
  json = [self NSDictionary:json];
  AGSSuggestParameters *param = [[AGSSuggestParameters alloc] init];
  
  param.categories = [self NSArray:json[@"categories"]];
  param.countryCode = [self NSString:json[@"countryCode"]];
  param.maxResults = [self NSInteger:json[@"maxResults"]];
  param.preferredSearchLocation = [self AGSPoint:json[@"preferredSearchLocation"]];
  param.searchArea = [self AGSGeometry:json[@"preferredSearchLocation"]];
  //TODO: error handling
  
  return param;
}

+(AGSGeocodeParameters *)AGSGeocodeParameters:(id)json {
  json = [self NSDictionary:json];
  AGSGeocodeParameters *param = [[AGSGeocodeParameters alloc] init];
  
  param.resultAttributeNames = [self NSArray:json[@"resultAttributeNames"]];
  param.categories = [self NSArray:json[@"categories"]];
  param.countryCode = [self NSString:json[@"countryCode"]];
  param.forStorage = [self BOOL:json[@"forStorage"]];
  param.maxResults = [self NSInteger:json[@"maxResults"]];
  param.minScore = [self double:json[@"minScore"]];
  param.outputLanguageCode = [self NSString:json[@"outputLanguageCode"]];
  param.outputSpatialReference = [self AGSSpatialReference:json[@"outputSpatialReference"]];
  param.preferredSearchLocation = [self AGSPoint:json[@"preferredSearchLocation"]];
  param.searchArea = [self AGSGeometry:json[@"preferredSearchLocation"]];
  
  
  return param;
}

+ (NSArray<AGSGraphic *> *)AGSGraphics:(id)json {
  NSArray *jsonArray = [self NSArray:json];
  NSMutableArray *graphics = [NSMutableArray arrayWithCapacity:jsonArray.count];
  for(id graphicJson in json) {
    [graphics addObject:[self AGSGraphic:graphicJson]];
  }
  return graphics;
}

+ (AGSGraphic *)AGSGraphic:(id)json {
  json = [self NSDictionary:json];
  NSDictionary *attributes = [self NSDictionary:json[@"attributes"]];
  AGSGeometry *geometry = [RCTConvert AGSGeometry:json[@"geometry"]];
  AGSSymbol *symbol = [RCTConvert AGSSymbol:json[@"symbol"]];
  AGSGraphic *graphic = [AGSGraphic graphicWithGeometry:geometry
                                                 symbol:symbol
                                             attributes:attributes];
  return graphic;
}

@end
