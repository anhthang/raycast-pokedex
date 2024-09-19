/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Preferred Language - Select your preferred language for Pokémon-related commands. */
  "language": "12" | "4" | "9" | "5" | "6" | "8" | "1" | "3" | "7",
  /** Data Cache Duration - Set the duration for caching Pokémon details. A value of 0 disables caching. */
  "duration": "0" | "1" | "3" | "7" | "14" | "30",
  /** Artwork Style - Choose the preferred artwork style for Pokémon. */
  "artwork": "official" | "pixel"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `pokemon` command */
  export type Pokemon = ExtensionPreferences & {}
  /** Preferences accessible in the `ability` command */
  export type Ability = ExtensionPreferences & {}
  /** Preferences accessible in the `move` command */
  export type Move = ExtensionPreferences & {}
  /** Preferences accessible in the `weakness` command */
  export type Weakness = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `pokemon` command */
  export type Pokemon = {}
  /** Arguments passed to the `ability` command */
  export type Ability = {}
  /** Arguments passed to the `move` command */
  export type Move = {}
  /** Arguments passed to the `weakness` command */
  export type Weakness = {}
}



