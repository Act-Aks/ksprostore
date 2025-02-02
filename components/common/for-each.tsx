import React, { Children } from 'react'

interface ForEachProps<T> {
    of: readonly T[] | T[]
    render: (item: T, index: number) => React.ReactNode
}

const ForEach = <T,>({ of, render }: ForEachProps<T>) =>
    of.map((item, index) => Children.toArray(render(item, index)))

export default ForEach
