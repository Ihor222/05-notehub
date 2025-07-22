import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchMovie } from '../services/movieService.ts'

export const useMoviesQuery = (query: string, page: number = 1, options: { enabled: boolean, placeholderData: typeof keepPreviousData }) => {
    return useQuery({
        queryKey: ['searchMovie', query, page],
        queryFn: () => fetchMovie(query, page),
        ...options
    })
}