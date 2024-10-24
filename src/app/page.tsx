"use client"
import { DisplayMode, useTrackModifier } from "./hooks/useTrackModifier"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { Music, Upload, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useTracks } from "./hooks/useTracks"

export default function Page() {
  const { tracks, setTracks, error } = useTracks([])

  const {
    displayTracks,
    setModifier: setDisplayMode,
    modifier,
  } = useTrackModifier(tracks)

  const formatDuration = (ms?: number): string => {
    if (!ms) return "--:--"
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    setTracks(file)
  }

  const modifierButtons: { name: string; displayMode: DisplayMode }[] = [
    { name: "Show All", displayMode: "all" },
    { name: "Show Duplicates", displayMode: "duplicates" },
    { name: "Show 69 Plays", displayMode: "69 plays" },
    { name: "Show Kanye", displayMode: "kanye" },
  ]

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="mb-4 flex items-center justify-between gap-2 text-2xl font-bold">
            <div className="flex flex-row items-center gap-4">
              <Music className="h-6 w-6" />
              Apple Music Viewer
            </div>
            <ThemeToggle />
          </h1>

          <div className="flex w-full items-center justify-center">
            <Label className="bg-secondary flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <Upload className="mb-3 h-8 w-8 text-gray-400 dark:text-white" />
                <p className="mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Apple Music XML file
                </p>
              </div>
              <Input
                type="file"
                className="hidden"
                accept=".xml"
                onChange={handleFileUpload}
              />
            </Label>
          </div>
        </div>

        {error && <div>Unfortunately there has been an error: {error}</div>}

        {displayTracks.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              {modifierButtons.map((button) => (
                <Button
                  key={button.name}
                  variant="outline"
                  onClick={() => setDisplayMode(button.displayMode)}
                  disabled={modifier === button.displayMode}
                >
                  {button.name}
                </Button>
              ))}
            </div>

            <div className="overflow-x-auto rounded-md">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Artist</th>
                    <th className="px-4 py-3">Album</th>
                    <th className="px-4 py-3">Genre</th>
                    <th className="px-4 py-3 text-center">
                      <Clock className="inline h-4 w-4" />
                    </th>
                    <th className="px-4 py-3">Year</th>
                    {/* <th className="px-4 py-3">Quality</th> */}
                    <th className="px-4 py-3 text-center">Plays</th>
                  </tr>
                </thead>
                <tbody>
                  {displayTracks.map((track, index) => (
                    <tr
                      key={track["Track ID"] || index}
                      className="hover:bg-secondary border-b"
                    >
                      <td className="px-4 py-3 font-medium">{track.Name}</td>
                      <td className="px-4 py-3">{track.Artist}</td>
                      <td className="px-4 py-3">{track.Album}</td>
                      <td className="px-4 py-3">{track.Genre}</td>
                      <td className="px-4 py-3 text-center">
                        {formatDuration(track["Total Time"])}
                      </td>
                      <td className="px-4 py-3">{track.Year}</td>
                      {/* <td className="px-4 py-3">
                        {track["Bit Rate"]}kbps /{" "}
                        {(track["Sample Rate"] || 0) / 1000}kHz
                      </td> */}
                      <td className="px-4 py-3 text-center">
                        {track["Play Count"]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
