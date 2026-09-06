import * as migration_20260903_085315_initial from './20260903_085315_initial';
import * as migration_20260903_164101_ajout_surtitres_etapes_resume from './20260903_164101_ajout_surtitres_etapes_resume';

export const migrations = [
  {
    up: migration_20260903_085315_initial.up,
    down: migration_20260903_085315_initial.down,
    name: '20260903_085315_initial',
  },
  {
    up: migration_20260903_164101_ajout_surtitres_etapes_resume.up,
    down: migration_20260903_164101_ajout_surtitres_etapes_resume.down,
    name: '20260903_164101_ajout_surtitres_etapes_resume'
  },
];
