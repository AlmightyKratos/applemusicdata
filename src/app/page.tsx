"use client"
import { useTrackModifier } from "./hooks/useTrackModifier"
import { Music, Upload, Clock } from "lucide-react"
import { useTracks } from "./hooks/useTracks"

const ItunesLibraryViewer = () => {
  const { tracks, setTracks, error } = useTracks([])

  const { displayTracks, setModifier: setDisplayMode } =
    useTrackModifier(tracks)

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

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold">
            <Music className="h-6 w-6" />
            iTunes Library Viewer
          </h1>

          <div className="flex w-full items-center justify-center">
            <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <Upload className="mb-3 h-8 w-8 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">iTunes Library XML file</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".xml"
                onChange={handleFileUpload}
                // disabled={isLoading}
              />
            </label>
          </div>
        </div>

        {error && <div>Alert</div>}

        {displayTracks.length > 0 && (
          <>
            <div className="flex flex-row gap-8">
              <button onClick={() => setDisplayMode("all")}>Show All</button>
              <button onClick={() => setDisplayMode("duplicates")}>
                Show Duplicates
              </button>
              <button onClick={() => setDisplayMode("69 plays")}>
                Show 69 plays
              </button>
              <button onClick={() => setDisplayMode("kanye")}>
                Show Kanye
              </button>
            </div>

            <div className="overflow-x-auto rounded-md">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-black">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Artist</th>
                    <th className="px-4 py-3">Album</th>
                    <th className="px-4 py-3">Genre</th>
                    <th className="px-4 py-3 text-center">
                      <Clock className="inline h-4 w-4" />
                    </th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Quality</th>
                    <th className="px-4 py-3 text-center">Plays</th>
                  </tr>
                </thead>
                <tbody>
                  {displayTracks.map((track, index) => (
                    <tr
                      key={track["Track ID"] || index}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium">{track.Name}</td>
                      <td className="px-4 py-3">{track.Artist}</td>
                      <td className="px-4 py-3">{track.Album}</td>
                      <td className="px-4 py-3">{track.Genre}</td>
                      <td className="px-4 py-3 text-center">
                        {formatDuration(track["Total Time"])}
                      </td>
                      <td className="px-4 py-3">{track.Year}</td>
                      <td className="px-4 py-3">
                        {track["Bit Rate"]}kbps /{" "}
                        {(track["Sample Rate"] || 0) / 1000}kHz
                      </td>
                      <td className="px-4 py-3 text-center">
                        {track["Play Count"]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ItunesLibraryViewer
