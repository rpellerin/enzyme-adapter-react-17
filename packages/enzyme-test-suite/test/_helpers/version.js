import React from 'react';
import semver from 'semver';

export const VERSION = React.version;

export function is(range) {
  if (/&&/.test(range)) {
    throw new RangeError('&& may not work properly in ranges, apparently');
  }
  return semver.satisfies(VERSION, range, { includePrerelease: true });
}

export const REACT16 = is('16');
export const REACT17 = is('^17.0.0-rc.0');
