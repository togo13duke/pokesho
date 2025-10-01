import { useEffect, useState, useCallback, useRef } from 'react'
import { PLACEHOLDER_IMAGE_PATH } from '../constants/pokemon'
import type { PieceType } from '../types/piece'
import { fetchPokemonImageByPieceType } from '../utils/imageCache'

interface UseImageCacheResult {
  imageUrl: string
  isLoading: boolean
  reload: () => Promise<void>
}

export function useImageCache(pieceType: PieceType): UseImageCacheResult {
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE_PATH)
  const [isLoading, setIsLoading] = useState(true)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const loadImage = useCallback(async () => {
    if (!isMountedRef.current) {
      return
    }

    setIsLoading(true)
    try {
      const result = await fetchPokemonImageByPieceType(pieceType)
      if (isMountedRef.current) {
        setImageUrl(result)
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [pieceType])

  useEffect(() => {
    loadImage()
  }, [loadImage])

  return {
    imageUrl,
    isLoading,
    reload: loadImage,
  }
}
