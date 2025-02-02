interface RenderIfProps<T> {
    condition: boolean
    then: T
    otherwise?: T
}

const RenderIf = <T,>({ condition, then, otherwise }: RenderIfProps<T>) => {
    if (condition) {
        return then
    }

    return otherwise
}

export default RenderIf
