"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DisplayMode, useTrackModifier } from "./hooks/useTrackModifier"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { Music, Upload, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useTracks } from "./hooks/useTracks"
import { toast } from "sonner"

const WhereIsLibrary = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-xs text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
        Where is my library file?
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to find your Apple Music library file</DialogTitle>
          <DialogDescription>
            Open your Apple Music application. In the top bar, select File -
            Library - Export Library. Save the file in an easily accessible
            location, then upload.
          </DialogDescription>
          <figure className="flex flex-col items-center">
            <img
              src="/exportLibraryDark.png"
              className="hidden p-8 dark:block"
            ></img>
            <img
              src="/exportLibraryLight.png"
              className="block p-8 dark:hidden"
            ></img>
            <figcaption className="text-sm">
              Open image in new tab for fullscreen image
            </figcaption>
          </figure>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default function Page() {
  const { tracks, setTracks, error } = useTracks([])

  if (error) {
    toast(error)
  }

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
            <div className="flex flex-row items-center gap-4 tracking-tight">
              <Music className="size-6" />
              Apple Music Viewer
            </div>
            <ThemeToggle />
          </h1>

          <div className="bg-secondary flex w-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-4 dark:border-none dark:bg-inherit">
            <Label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border p-4 transition-transform hover:scale-105">
              <Upload className="size-8 text-gray-400" />
              <p className="text-sm">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <Input
                type="file"
                className="hidden"
                accept=".xml"
                onChange={handleFileUpload}
              />
            </Label>
            <WhereIsLibrary />
          </div>
        </div>

        {displayTracks.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="inline space-x-4 space-y-4">
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
                      <Clock className="inline size-4" />
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
