/**
 * THIS IS A GENERATED FILE. DO NOT EDIT!
 *
 * Total icons: 6
 * Total categories: 1
 */

export type IconCategory =
  | 'common';

export type IconName =
  | 'common/home'
  | 'common/moon'
  | 'common/palette'
  | 'common/settings'
  | 'common/sun'
  | 'common/user';

export interface IconMetadata {
  name: IconName;
  category: IconCategory;
  viewBox: string;
  width: number;
  height: number;
  hasMultipleColors: boolean;
  colorCount: number;
}

export const ICON_METADATA: Record<IconName, IconMetadata> = {
  'common/home': {
    name: 'common/home',
    category: 'common',
    viewBox: '0 0 24 24',
    width: 24,
    height: 24,
    hasMultipleColors: false,
    colorCount: 0
  },
  'common/moon': {
    name: 'common/moon',
    category: 'common',
    viewBox: '0 0 24 24',
    width: 24,
    height: 24,
    hasMultipleColors: false,
    colorCount: 0
  },
  'common/palette': {
    name: 'common/palette',
    category: 'common',
    viewBox: '0 0 24 24',
    width: 24,
    height: 24,
    hasMultipleColors: true,
    colorCount: 6
  },
  'common/settings': {
    name: 'common/settings',
    category: 'common',
    viewBox: '0 0 24 24',
    width: 24,
    height: 24,
    hasMultipleColors: false,
    colorCount: 0
  },
  'common/sun': {
    name: 'common/sun',
    category: 'common',
    viewBox: '0 0 24 24',
    width: 24,
    height: 24,
    hasMultipleColors: false,
    colorCount: 0
  },
  'common/user': {
    name: 'common/user',
    category: 'common',
    viewBox: '0 0 24 24',
    width: 24,
    height: 24,
    hasMultipleColors: false,
    colorCount: 1
  }
};

export const ICON_NAMES = [
  'common/home',
  'common/moon',
  'common/palette',
  'common/settings',
  'common/sun',
  'common/user'
] as const;

export const ICON_CATEGORIES: Record<IconCategory, readonly IconName[]> = {
  'common': ['common/home', 'common/moon', 'common/palette', 'common/settings', 'common/sun', 'common/user']
};
