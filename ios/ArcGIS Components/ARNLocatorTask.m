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
  if([self rejectWhenUninitialized:reject]) {
    return;
  }
  
  __weak __typeof__(self) welf = self;

  [_locatorTask suggestWithSearchText:searchText completion:^(NSArray<AGSSuggestResult *> * _Nullable suggestResults, NSError * _Nullable error) {
    if(suggestResults.count > 0) {
      RCTLog(@"%@", suggestResults.ags_toJSON);
      resolve([welf jsonFromSuggestResults:suggestResults]);
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

@end
