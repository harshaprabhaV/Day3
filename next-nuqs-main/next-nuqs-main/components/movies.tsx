'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Document } from 'mongodb'
import { useTransition } from 'react'
import { parseAsInteger, useQueryState } from 'nuqs'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'

export default function Movies({ movies }: { movies?: Document[] }) {
  const [isLoading, startTransition] = useTransition()

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger
      .withDefault(1)
      .withOptions({ shallow: false, startTransition })
  )

  const [search, setSearch] = useQueryState('query', {
    defaultValue: '',
    shallow: false,
    startTransition
  })

  const handleNextPage = () => setPage(page + 1)
  const handlePreviousPage = () => setPage(page - 1)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value)

  return (
    <>
      <header className='mb-8'>
        <div className='flex items-center justify-between'>
          <Input
            type='text'
            placeholder='Search movies...'
            value={search}
            onChange={handleSearchChange}
            className='w-1/2'
          />
          <div className='flex gap-4'>
            <Button
              onClick={handlePreviousPage}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button onClick={handleNextPage} disabled={isLoading}>
              Next
            </Button>
          </div>
        </div>
      </header>
      {isLoading ? (
        <ul
          role='list'
          className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8'
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <li key={index} className='relative'>
              <Skeleton className='aspect-square w-full rounded-lg bg-gray-100' />
              <Skeleton className='mt-2 h-4 w-3/4 rounded' />
              <Skeleton className='mt-1 h-4 w-1/2 rounded' />
              <Skeleton className='mt-1 h-4 w-1/4 rounded' />
            </li>
          ))}
        </ul>
      ) : (
        <ul
          role='list'
          className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8'
        >
          {movies?.map(movie => (
            <li key={movie._id.toString()} className='relative'>
              <Link href={`/movies/${movie._id}`}>
                <div className='group aspect-square w-full overflow-hidden rounded-lg bg-gray-100'>
                  {movie.poster && (
                    <Image
                      src={movie.poster}
                      alt=''
                      className='w-full object-cover group-hover:opacity-75'
                      width={300}
                      height={300}
                    />
                  )}
                </div>

                <p className='mt-2 block truncate font-medium'>{movie.title}</p>
                <p className='block text-sm font-medium text-gray-500'>
                  {movie.cast?.join(', ')}
                </p>
                <p className='block text-sm font-medium text-gray-500'>
                  {movie.year}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
