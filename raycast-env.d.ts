/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Language - Your preferred language. Supporting Pokémon command only. */
  "language": "12" | "4" | "9" | "5" | "6" | "8" | "1" | "3" | "7"
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
}

declare namespace Arguments {
  /** Arguments passed to the `pokemon` command */
  export type Pokemon = {}
  /** Arguments passed to the `ability` command */
  export type Ability = {}
  /** Arguments passed to the `move` command */
  export type Move = {}
}

