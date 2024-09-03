export function useAudio() {
  const audio = new Audio()
  let _endTimeS: number | undefined

  useEventListener(audio, 'timeupdate', () => {
    if (_endTimeS && audio.currentTime > _endTimeS) {
      audio.pause()
      _endTimeS = undefined
    }
  })

  function updateSource(source: string) {
    audio.src = source
    audio.load()
  }

  function play(startTimeS: number, endTimeS?: number) {
    if (endTimeS !== undefined && endTimeS <= startTimeS) {
      return
    }

    audio.currentTime = startTimeS
    _endTimeS = endTimeS
    audio.play()
  }

  function pause() {
    audio.pause()
  }

  return {
    audioInstance: audio,
    playAudio: play,
    pauseAudio: pause,
    updateSource,
  }
}
