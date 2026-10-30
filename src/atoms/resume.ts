import { atom } from 'jotai'

export const resumeAtom = atom({
  url: '',
  isLoading: false,
  isError: false
})

resumeAtom.debugLabel = 'resumeAtom'
