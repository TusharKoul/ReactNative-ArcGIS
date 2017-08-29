//
//  ARNLocatorTask.m
//  ArcGISReactSample
//
//  Created by Tushar Koul on 8/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "ARNLocatorTask.h"
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import "RCTConvert+ArcGIS.h"

#import <ArcGIS/ArcGIS.h>

@implementation ARNLocatorTask
{
  AGSLocatorTask *_locatorTask;
}

RCT_EXPORT_MODULE(AGSTaskLocator);


RCT_EXPORT_METHOD(initWithURL:(NSString*)urlString) {
  NSURL *url = [NSURL URLWithString:urlString];
  _locatorTask = [AGSLocatorTask locatorTaskWithURL:url];
}


RCT_EXPORT_METHOD(suggestWithSearchText:(NSString *)searchText
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self suggestWithSearchText:searchText
                   parameters:nil
                     resolver:resolve
                     rejecter:reject];
}


RCT_REMAP_METHOD(suggestWithSearchTextAndParameters,
                 suggestWithSearchText:(NSString *)searchText parameters:(NSDictionary *)parameters
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if([self rejectWhenUninitialized:reject]) {
    return;
  }
  
  AGSSuggestParameters *params = nil;
  if(parameters) {
    params = [RCTConvert AGSSuggestParameters:parameters];
  }
  
  __weak __typeof__(self) welf = self;
  [_locatorTask suggestWithSearchText:searchText
                           parameters:params
                           completion:^(NSArray<AGSSuggestResult *> * _Nullable suggestResults, NSError * _Nullable error) {
    if(suggestResults.count > 0) {
      resolve([welf jsonFromSuggestResults:suggestResults]);
    }
    else {
      reject(@(error.code).stringValue,@"no results found, try again",error);
    }
  }];
}


RCT_EXPORT_METHOD(geocodeWithSearchText:(NSString *)searchText
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self geocodeWithSearchText:searchText
                   parameters:nil
                     resolver:resolve
                     rejecter:reject];
}


RCT_REMAP_METHOD(geocodeWithSearchTextAndParameters,
                 geocodeWithSearchText:(NSString *)searchText parameters:(NSDictionary *)parameters
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  if([self rejectWhenUninitialized:reject]) {
    return;
  }
  
  AGSGeocodeParameters *params = nil;
  if(parameters) {
    params = [RCTConvert AGSGeocodeParameters:parameters];
  }
  
  __weak __typeof__(self) welf = self;
  [_locatorTask geocodeWithSearchText:searchText parameters:params completion:^(NSArray<AGSGeocodeResult *> * _Nullable geocodeResults, NSError * _Nullable error) {
    if(geocodeResults.count > 0) {
      resolve([welf jsonFromGeocodeResults:geocodeResults]);
    }
    else {
      reject(@(error.code).stringValue,@"no results found, try again",error);
    }
  }];
  
  
}


-(bool)rejectWhenUninitialized:(RCTPromiseRejectBlock)reject {
  if(_locatorTask == nil) {
    NSError *error = [NSError errorWithDomain:@"ARNLocatorTaskDomain"
                                         code:1
                                     userInfo:nil];
    reject(@"1", @"initialize locator task before calling its methods", error);
    
    return YES;
  }
  return NO;
}

-(NSArray *)jsonFromSuggestResults:(NSArray<AGSSuggestResult *> *)results {
  NSMutableArray *jsonResults = [[NSMutableArray alloc] init];

  for(AGSSuggestResult* result in results) {
    NSDictionary *json = @{@"label": result.label,
                           @"isCollection" : @(result.isCollection)};
    [jsonResults addObject:json];
  }

  //return immutable copy
  return [jsonResults copy];
}

-(NSArray *)jsonFromGeocodeResults:(NSArray<AGSGeocodeResult *> *)results {
  NSMutableArray *jsonResults = [[NSMutableArray alloc] init];
  
  NSError *error = nil;
  for(AGSGeocodeResult* result in results) {
    NSDictionary *json = @{
                           @"displayLocation":[result.displayLocation toJSON:&error],
                           @"extent": [result.extent toJSON:&error],
                           @"inputLocation": [result.inputLocation toJSON:&error],
                           @"label": result.label,
                           @"routeLocation": [result.routeLocation toJSON:&error],
                           @"score": @(result.score),
                           @"attributes": result.attributes
                          };
    [jsonResults addObject:json];
  }
  
  //return immutable copy
  return [jsonResults copy];
}

@end
