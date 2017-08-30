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
  NSString *type = [self NSString:json[@"type"]];
  if(type == nil) {
    RCTLogError(@"Graphics needs a type (point, polyline or polygon");
    return nil;
  }
  
  if ([type isEqualToString:@"point"]) {
    return [self pointGraphic:json];
  }
  else if ([type isEqualToString:@"polyline"]) {
    
  }
  else if ([type isEqualToString:@"polygon"]) {
    
  }
  else {
    RCTLogError(@"Graphics needs a type (point, polyline or polygon");
    return nil;
  }

  return nil;
}

+ (AGSGraphic *)pointGraphic:(NSDictionary *)json {
  NSDictionary *attributes = [self NSDictionary:json[@"attributes"]];
  NSArray *coordinates = [self NSArray:json[@"coordinates"]];
  int style = [self int:json[@"style"]];
  int size = [self int:json[@"size"]];
  if (size <= 0) {
    size = 10;
    RCTLogWarn(@"Point graphic needs size greater than 0, default set to 10");
  }
  UIColor *color = [self UIColor:json[@"color"]];
  if (color == nil) {
    color = UIColor.redColor;
  }
  
  AGSPoint *point = [self AGSPoint:coordinates[0]];
  AGSSymbol *symbol = [AGSSimpleMarkerSymbol simpleMarkerSymbolWithStyle:style
                                                                   color:color
                                                                    size:size];
  AGSGraphic *graphic = [AGSGraphic graphicWithGeometry:point
                                                 symbol:symbol
                                             attributes:attributes];
  return graphic;
}
@end
