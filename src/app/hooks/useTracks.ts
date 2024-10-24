import { useState } from "react"

export interface Track {
  "Track ID"?: number
  Name?: string
  Artist?: string
  "Album Artist"?: string
  Composer?: string
  Album?: string
  Genre?: string
  Kind?: string
  Size?: number
  "Total Time"?: number
  Year?: number
  "Date Added"?: string
  "Bit Rate"?: number
  "Sample Rate"?: number
  "Play Count"?: number
  [key: string]: string | number | undefined
}

export interface ParsedTracks {
  tracks: Track[]
  error?: string
}

const parseTracksXml = (xmlString: string): ParsedTracks => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, "text/xml")

    const parserError = xmlDoc.querySelector("parsererror")
    if (parserError) {
      throw new Error("XML parsing error")
    }

    const tracks: Track[] = []
    const trackDicts = xmlDoc.evaluate(
      "//dict[key='Tracks']/dict/dict",
      xmlDoc,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null,
    )

    for (let i = 0; i < trackDicts.snapshotLength; i++) {
      const trackDict = trackDicts.snapshotItem(i)
      if (!trackDict || !(trackDict instanceof Element)) continue

      const track: Track = {}
      const keys = Array.from(trackDict.getElementsByTagName("key"))

      for (const key of keys) {
        const value = key.nextElementSibling
        if (!value || !key.textContent) continue

        const keyName = key.textContent

        if (value instanceof Element) {
          switch (value.tagName.toLowerCase()) {
            case "integer":
              track[keyName] = parseInt(value.textContent || "0", 10)
              break
            case "string":
              track[keyName] = value.textContent || ""
              break
            case "date":
              track[keyName] = value.textContent || ""
              break
          }
        }
      }

      if (Object.keys(track).length > 0) {
        tracks.push(track)
      }
    }

    return { tracks }
  } catch (error) {
    return {
      tracks: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export const useTracks = (tracksArg: Track[]) => {
  const [tracks, setTracks1] = useState<Track[]>(tracksArg)
  const [error, setError] = useState<string | null>(null)

  const setTracks = async (file: File) => {
    const text = await file.text()

    const transformedData = parseTracksXml(text)
    if (transformedData.error) {
      setError(transformedData.error)
    } else {
      setTracks1(transformedData.tracks)
    }
  }

  return { tracks, setTracks, error }
}
