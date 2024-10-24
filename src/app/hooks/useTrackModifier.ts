import { Track } from "./useTracks"
import { useState } from "react"

export type DisplayMode = "all" | "duplicates" | "69 plays" | "kanye"

const displayFunc = (displayMode: DisplayMode) => {
  switch (displayMode) {
    case "all":
      return isAll
    case "69 plays":
      return plays69
    case "duplicates":
      return findRepeats
    case "kanye":
      return isKanye
  }
}
const isAll = (tracks: Track[]) => tracks

const plays69 = (tracks: Track[]) => {
  return tracks.filter((track) => track["Play Count"] === 69)
}
const isKanye = (tracks: Track[]) => {
  return tracks.filter((track) => track.Artist === "Kanye West")
}

export const getDisplayTracks = (tracks: Track[], displayMode: DisplayMode) => {
  const operation = displayFunc(displayMode)
  return operation(tracks)
}
const findRepeats = (tracks: Track[]) => {
  const seen = new Map()
  const repeats = []
  for (const track of tracks) {
    const key = `${track.Name}-${track.Artist}`
    const count = seen.get(key) || 0
    if (count === 0) {
      seen.set(key, count + 1)
    } else if (count === 1) {
      repeats.push(track)
      seen.set(key, count + 1)
    } else {
      continue
    }
  }
  return repeats
}

export const useTrackModifier = (
  tracks: Track[],
  modifierArg: DisplayMode = "all",
) => {
  const [modifier, setModifier] = useState<DisplayMode>(modifierArg)
  const operation = displayFunc(modifier)
  const displayTracks = operation(tracks)
  return { displayTracks, setModifier }
}
