import * as migration_20260903_021453_initial from './20260903_021453_initial';

export const migrations = [
  {
    up: migration_20260903_021453_initial.up,
    down: migration_20260903_021453_initial.down,
    name: '20260903_021453_initial'
  },
];
