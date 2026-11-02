# ADR-001: Adopting React Native for Mobile Development

**Status:** Accepted  
**Date:** 2026-10-23

## Decision

We have decided to use **React Native with Expo and TypeScript** to develop our mobile application for iOS and Android.

## Background

Our application must run on both platforms, provide a native user experience, and access device capabilities such as the camera, geolocation, and local storage.

We want to minimize development time while maintaining a reliable and scalable codebase.

## Considerations

We evaluated four approaches:

- **Native (Swift/Kotlin):** Best platform integration, but requires two separate codebases.
- **Flutter:** Strong cross-platform capabilities, but requires learning Dart.
- **PWA:** Easy to deploy, but has platform-dependent limitations when accessing native features.
- **React Native:** Shared TypeScript codebase, native UI components, and access to device APIs.

React Native offers the best balance between development efficiency, performance, and native capabilities for our requirements.

## Consequences

- A single codebase can target both iOS and Android.
- Expo simplifies development, native integrations, and builds.
- Some platform-specific code may still be necessary.
- Performance and compatibility of third-party libraries must be monitored.

## Ownership

The development team is responsible for maintaining the architecture and ensuring cross-platform compatibility.

## Review

This decision will be revisited if technical limitations or new requirements significantly affect the application's performance or native capabilities.
